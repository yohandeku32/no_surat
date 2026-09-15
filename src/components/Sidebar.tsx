            >
              Oemasi, Nekamese
            </div>

            <div
              style={{
                fontSize: '13px',
                color: '#f1f5f9',
                lineHeight: 1.55,
              }}
            >
              Kabupaten Kupang,
              <br />
              Nusa Tenggara Timur
            </div>
          </div>

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
        </div>
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Atur lebar sidebar"
        title="Tarik untuk mengatur lebar sidebar"
        onMouseDown={startResize}
        onDoubleClick={resetWidth}
        style={{
          position: 'absolute',
          top: 0,
          right: '-5px',
          width: '10px',
          height: '100%',
          cursor: 'col-resize',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '4px',
            height: '54px',
            borderRadius: '99px',
            background: 'rgba(255,255,255,.18)',
            transition: 'all .18s ease',
          }}
        />
        <GripVertical
          size={14}
          style={{
            position: 'absolute',
            color: 'rgba(255,255,255,.6)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <style>
        {`
          .sidebar {
            flex-shrink: 0;
            transition: width .08s linear, min-width .08s linear, max-width .08s linear;
          }

          .sidebar .nav-item {
            box-sizing: border-box;
          }

          .sidebar [role="separator"]:hover > div {
            background: rgba(255,255,255,.45) !important;
            width: 5px !important;
          }

          .sidebar [role="separator"]:active > div {
            background: #ffffff !important;
            width: 5px !important;
          }

          @media (max-width: 900px) {
            .sidebar {
              width: 250px !important;
              min-width: 250px !important;
              max-width: 250px !important;
            }
          }
        `}
      </style>
    </aside>
  )
}
