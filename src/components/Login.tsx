import { FormEvent, useState } from 'react'
import {
  Eye,
  EyeOff,
  KeyRound,
  LogIn,
  ShieldCheck,
} from 'lucide-react'

interface Props {
  onLogin: () => void
}

const LOGIN_PASSWORD = 'kuaputu01'

export function Login({ onLogin }: Props) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (loading) return

    setError('')
    setLoading(true)

    window.setTimeout(() => {
      if (password === LOGIN_PASSWORD) {
        onLogin()
        return
      }

      setError('Password yang Anda masukkan tidak benar.')
      setPassword('')
      setLoading(false)
    }, 250)
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '28px',
        background:
          'linear-gradient(135deg, #eaf3f5 0%, #f5f8f9 52%, #eef4f5 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          background: '#ffffff',
          border: '1px solid #d8e3e6',
          borderTop: '4px solid #48c6a8',
          borderRadius: '16px',
          boxShadow:
            '0 18px 50px rgba(31, 53, 61, 0.13)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '30px 30px 22px',
            background: '#f7fbfb',
            borderBottom: '1px solid #e6edef',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '54px',
              height: '54px',
              borderRadius: '13px',
              background: '#dff6ee',
              color: '#179b78',
              marginBottom: '18px',
            }}
          >
            <ShieldCheck size={28} />
          </div>

          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '1.2px',
              color: '#3f9d8a',
              marginBottom: '7px',
            }}
          >
            AKSES SISTEM
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: '27px',
              lineHeight: 1.15,
              color: '#1d3238',
              letterSpacing: '-0.4px',
            }}
          >
            SIPESURAT
          </h1>

          <p
            style={{
              margin: '8px 0 0',
              fontSize: '13px',
              lineHeight: 1.6,
              color: '#70838a',
            }}
          >
            Sistem Pengelolaan Surat Sekolah
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            padding: '28px 30px 30px',
          }}
        >
          <div style={{ marginBottom: '18px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                marginBottom: '8px',
                color: '#2d4349',
                fontSize: '13px',
                fontWeight: 800,
              }}
            >
              <KeyRound size={16} />
              Password
            </div>

            <div
              style={{
                position: 'relative',
              }}
            >
              <input
                autoFocus
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (error) setError('')
                }}
                placeholder="Masukkan password"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  height: '48px',
                  padding:
                    '0 48px 0 14px',
                  border: error
                    ? '1px solid #ef8d8d'
                    : '1px solid #cddade',
                  borderRadius: '10px',
                  background: '#ffffff',
                  color: '#1f343a',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((value) => !value)
                }
                aria-label={
                  showPassword
                    ? 'Sembunyikan password'
                    : 'Tampilkan password'
                }
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '9px',
                  transform: 'translateY(-50%)',
                  width: '34px',
                  height: '34px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: '#799098',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {error && (
              <div
                style={{
                  marginTop: '9px',
                  padding: '10px 12px',
                  borderRadius: '9px',
                  background: '#fff3f3',
                  border: '1px solid #f3c3c3',
                  color: '#a33d3d',
                  fontSize: '12px',
                  lineHeight: 1.45,
                }}
              >
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              height: '48px',
              border: 'none',
              borderRadius: '10px',
              background:
                loading || !password
                  ? '#b8c9c9'
                  : '#f4cc2b',
              color:
                loading || !password
                  ? '#647477'
                  : '#263438',
              fontSize: '14px',
              fontWeight: 800,
              cursor:
                loading || !password
                  ? 'not-allowed'
                  : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '9px',
            }}
          >
            <LogIn size={17} />
            {loading ? 'Memeriksa...' : 'Masuk ke SIPESURAT'}
          </button>

          <div
            style={{
              marginTop: '18px',
              paddingTop: '18px',
              borderTop: '1px solid #edf1f2',
              textAlign: 'center',
              fontSize: '11px',
              color: '#8a9aa0',
              lineHeight: 1.55,
            }}
          >
            SDK ST. YOSEPH KUAPUTU
            <br />
            Oemasi, Nekamese, Kabupaten Kupang
          </div>
        </form>
      </div>
    </main>
  )
}
