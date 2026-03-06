import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import BadgeIcon from '../components/BadgeIcon'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const initials = user?.email?.substring(0, 2).toUpperCase() || 'EN'

  return (
    <div style={{minHeight:'100vh',background:'#050507',color:'#F4F2EE',fontFamily:"'Exo 2',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&family=Exo+2:wght@300;400;500;600&family=Share+Tech+Mono&display=swap');`}</style>

      {/* Header */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid #111116',background:'#08090d'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'linear-gradient(135deg,#c084fc,#60d8fa)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Rajdhani,sans-serif',fontWeight:'800',fontSize:'13px',color:'#fff'}}>en</div>
          <span style={{fontFamily:'Share Tech Mono,monospace',fontSize:'10px',letterSpacing:'0.2em',color:'rgba(255,255,255,0.3)'}}>NATIVE WORKSPACE</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <BadgeIcon type="founder" size={16} />
          <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'linear-gradient(135deg,#1a0a30,#0d0520)',border:'1.5px solid rgba(192,132,252,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Rajdhani,sans-serif',fontWeight:'700',fontSize:'12px',color:'#c084fc'}}>{initials}</div>
        </div>
      </div>

      <div style={{padding:'20px',maxWidth:'600px',margin:'0 auto'}}>

        {/* Profile Card */}
        <div style={{background:'#08090d',border:'1px solid #111116',borderRadius:'16px',padding:'20px',marginBottom:'12px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'16px'}}>
            <div style={{width:'52px',height:'52px',borderRadius:'50%',background:'linear-gradient(135deg,#1a0a30,#0d0520)',border:'2px solid rgba(192,132,252,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Rajdhani,sans-serif',fontWeight:'700',fontSize:'18px',color:'#c084fc',flexShrink:0}}>{initials}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:'Rajdhani,sans-serif',fontWeight:'700',fontSize:'1rem',marginBottom:'2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email}</div>
              <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'10px',color:'#c084fc',letterSpacing:'0.1em'}}>eN·FOUNDER·001</div>
            </div>
            <BadgeIcon type="founder" size={18} />
          </div>
          <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
            {['Permanent ID','20 Invites','Priority'].map(p => (
              <span key={p} style={{fontFamily:'Share Tech Mono,monospace',fontSize:'9px',letterSpacing:'0.1em',padding:'4px 10px',borderRadius:'20px',border:'1px solid rgba(192,132,252,0.2)',color:'rgba(192,132,252,0.7)',background:'rgba(192,132,252,0.05)'}}>{p}</span>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'12px'}}>
          {[
            {label:'Total Calls',value:'1,284',color:'#c084fc',sub:'All time'},
            {label:'Mins This Week',value:'348',color:'#60d8fa',sub:'+12% vs last week'},
            {label:'Contacts',value:'47',color:'#6ee7b7',sub:'Verified eNumbers'},
            {label:'Call Quality',value:'98.6%',color:'#fcd34d',sub:'AI-optimised'},
          ].map(s => (
            <div key={s.label} style={{background:'#08090d',border:'1px solid #111116',borderRadius:'14px',padding:'16px'}}>
              <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'9px',letterSpacing:'0.12em',color:'rgba(255,255,255,0.3)',marginBottom:'8px',textTransform:'uppercase'}}>{s.label}</div>
              <div style={{fontFamily:'Rajdhani,sans-serif',fontWeight:'700',fontSize:'1.6rem',color:s.color,marginBottom:'4px'}}>{s.value}</div>
              <div style={{fontSize:'10px',color:'rgba(255,255,255,0.3)'}}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'12px'}}>
          {[
            {icon:'📞',label:'Dialler',path:'/contacts'},
            {icon:'👥',label:'Contacts',path:'/contacts'},
            {icon:'🏅',label:'Badges',path:'/badges'},
          ].map(a => (
            <div key={a.label} onClick={() => navigate(a.path)} style={{background:'#08090d',border:'1px solid #111116',borderRadius:'14px',padding:'16px',textAlign:'center',cursor:'pointer',transition:'border-color 0.2s'}}>
              <div style={{fontSize:'1.4rem',marginBottom:'8px'}}>{a.icon}</div>
              <div style={{fontFamily:'Share Tech Mono,monospace',fontSize:'9px',letterSpacing:'0.12em',color:'rgba(255,255,255,0.4)'}}>{a.label}</div>
            </div>
          ))}
        </div>

        {/* Sign Out */}
        <button onClick={signOut} style={{width:'100%',padding:'13px',background:'transparent',border:'1px solid #1a1a24',borderRadius:'12px',color:'rgba(255,255,255,0.3)',fontFamily:'Share Tech Mono,monospace',fontSize:'10px',letterSpacing:'0.2em',cursor:'pointer'}}>
          SIGN OUT
        </button>
      </div>

      {/* Bottom Nav */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#08090d',borderTop:'1px solid #111116',display:'flex',justifyContent:'space-around',padding:'12px 0 20px'}}>
        {[
          {icon:'⊞',label:'Home',path:'/dashboard'},
          {icon:'📞',label:'Dialler',path:'/contacts'},
          {icon:'👥',label:'Contacts',path:'/contacts'},
          {icon:'🏅',label:'Badges',path:'/badges'},
        ].map(n => (
          <div key={n.label} onClick={() => navigate(n.path)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',cursor:'pointer',opacity:n.path==='/dashboard'?1:0.4}}>
            <span style={{fontSize:'1.1rem'}}>{n.icon}</span>
            <span style={{fontFamily:'Share Tech Mono,monospace',fontSize:'8px',letterSpacing:'0.1em',color:'rgba(255,255,255,0.5)'}}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
