import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

// Low bandwidth audio constraints
const AUDIO_NORMAL = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 48000
  }
};

const AUDIO_LOW_BANDWIDTH = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 16000,
    channelCount: 1
  }
};

export function useWebRTC(currentUser, lowBandwidth = false) {
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [callStatus, setCallStatus] = useState('idle');
  const pc = useRef(null);
  const localStream = useRef(null);
  const callId = useRef(null);

  const getMedia = async () => {
    const constraints = lowBandwidth ? AUDIO_LOW_BANDWIDTH : AUDIO_NORMAL;
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    localStream.current = stream;
    return stream;
  };

  const applyBandwidthLimit = (sdp) => {
    if (!lowBandwidth) return sdp;
    // Cap audio bitrate to 20kbps on low bandwidth
    return sdp.replace(/a=mid:audio\r\n/g, 'a=mid:audio\r\nb=AS:20\r\n');
  };

  const createPeerConnection = (onTrack) => {
    const conn = new RTCPeerConnection(ICE_SERVERS);
    if (localStream.current) {
      localStream.current.getTracks().forEach(t => conn.addTrack(t, localStream.current));
    }

    // VAD — pause/resume audio track based on silence
    if (lowBandwidth && localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(localStream.current);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let silenceTimer = null;

        const checkVoiceActivity = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          if (avg < 5) {
            // Silence — disable track after 300ms
            if (!silenceTimer) {
              silenceTimer = setTimeout(() => {
                audioTrack.enabled = false;
              }, 300);
            }
          } else {
            // Voice detected — re-enable immediately
            if (silenceTimer) {
              clearTimeout(silenceTimer);
              silenceTimer = null;
            }
            audioTrack.enabled = true;
          }
          requestAnimationFrame(checkVoiceActivity);
        };
        checkVoiceActivity();
      }
    }

    conn.ontrack = (e) => onTrack && onTrack(e.streams[0]);
    return conn;
  };

  // Listen for incoming calls
  useEffect(() => {
    if (!currentUser) return;
    const channel = supabase
      .channel('incoming-calls')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'calls',
        filter: `callee_id=eq.${currentUser.id}`
      }, (payload) => {
        if (payload.new.status === 'pending') {
          setIncomingCall(payload.new);
          setCallStatus('incoming');
        }
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [currentUser]);

  const startCall = async (calleeId, calleeEnumber, onRemoteStream) => {
    try {
      setCallStatus('connecting');
      await getMedia();
      pc.current = createPeerConnection(onRemoteStream);

      const offer = await pc.current.createOffer();
      const optimisedSdp = applyBandwidthLimit(offer.sdp);
      const optimisedOffer = { ...offer, sdp: optimisedSdp };
      await pc.current.setLocalDescription(optimisedOffer);

      const { data } = await supabase.from('calls').insert({
        caller_id: currentUser.id,
        callee_id: calleeId,
        caller_enumber: currentUser.enumber,
        callee_enumber: calleeEnumber,
        offer: optimisedOffer,
        status: 'pending'
      }).select().single();

      callId.current = data.id;
      setActiveCall(data);

      pc.current.onicecandidate = async (e) => {
        if (e.candidate) {
          await supabase.from('ice_candidates').insert({
            call_id: callId.current,
            sender_id: currentUser.id,
            candidate: e.candidate
          });
        }
      };

      const answerChannel = supabase
        .channel(`call-answer-${data.id}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'calls',
          filter: `id=eq.${data.id}`
        }, async (payload) => {
          if (payload.new.answer && pc.current.signalingState !== 'stable') {
            await pc.current.setRemoteDescription(payload.new.answer);
            setCallStatus('active');
          }
        })
        .subscribe();

    } catch (err) {
      console.error('startCall error:', err);
      setCallStatus('error');
    }
  };

  const answerCall = async (call, onRemoteStream) => {
    try {
      setCallStatus('connecting');
      await getMedia();
      pc.current = createPeerConnection(onRemoteStream);

      await pc.current.setRemoteDescription(call.offer);
      const answer = await pc.current.createAnswer();
      const optimisedSdp = applyBandwidthLimit(answer.sdp);
      const optimisedAnswer = { ...answer, sdp: optimisedSdp };
      await pc.current.setLocalDescription(optimisedAnswer);

      await supabase.from('calls').update({
        answer: optimisedAnswer,
        status: 'active'
      }).eq('id', call.id);

      callId.current = call.id;
      setActiveCall(call);
      setIncomingCall(null);
      setCallStatus('active');

      pc.current.onicecandidate = async (e) => {
        if (e.candidate) {
          await supabase.from('ice_candidates').insert({
            call_id: call.id,
            sender_id: currentUser.id,
            candidate: e.candidate
          });
        }
      };

    } catch (err) {
      console.error('answerCall error:', err);
      setCallStatus('error');
    }
  };

  const endCall = async () => {
    if (callId.current) {
      await supabase.from('calls').update({ status: 'ended' }).eq('id', callId.current);
    }
    pc.current?.close();
    localStream.current?.getTracks().forEach(t => t.stop());
    pc.current = null;
    localStream.current = null;
    callId.current = null;
    setActiveCall(null);
    setIncomingCall(null);
    setCallStatus('idle');
  };

  const rejectCall = async (call) => {
    await supabase.from('calls').update({ status: 'rejected' }).eq('id', call.id);
    setIncomingCall(null);
    setCallStatus('idle');
  };

  return { incomingCall, activeCall, callStatus, startCall, answerCall, endCall, rejectCall };
}
