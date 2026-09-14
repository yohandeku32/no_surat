<button
  type="button"
  onClick={onLogout}
  title="Keluar dari SIPESURAT"
  style={{
    width: '100%',
    marginTop: '12px',
    border: '1px solid #dc2626',
    background: '#dc2626',
    color: '#ffffff',
    borderRadius: '11px',
    padding: '11px 13px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: 750,
    cursor: 'pointer',
    transition: 'all .18s ease',
  }}
  onMouseEnter={(event) => {
    event.currentTarget.style.background = '#b91c1c'
    event.currentTarget.style.borderColor = '#b91c1c'
  }}
  onMouseLeave={(event) => {
    event.currentTarget.style.background = '#dc2626'
    event.currentTarget.style.borderColor = '#dc2626'
  }}
>
  <LogOut size={16} />
  Keluar
</button>
