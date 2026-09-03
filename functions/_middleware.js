const COOKIE_NAME = 'r6s_board_auth'

const encoder = new TextEncoder()

function toBase64Url(bytes) {
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

async function createSignature(
  value,
  secret
) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  )

  const signature =
    await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(value)
    )

  return toBase64Url(
    new Uint8Array(signature)
  )
}

async function createToken(secret) {
  const expires =
    Date.now() +
    1000 * 60 * 60 * 24 * 7

  const payload =
    String(expires)

  const signature =
    await createSignature(
      payload,
      secret
    )

  return `${payload}.${signature}`
}

async function verifyToken(
  token,
  secret
) {
  if (!token) {
    return false
  }

  const parts =
    token.split('.')

  if (parts.length !== 2) {
    return false
  }

  const [
    expires,
    suppliedSignature,
  ] = parts

  const expiresNumber =
    Number(expires)

  if (
    !Number.isFinite(
      expiresNumber
    )
  ) {
    return false
  }

  if (
    Date.now() >
    expiresNumber
  ) {
    return false
  }

  const expectedSignature =
    await createSignature(
      expires,
      secret
    )

  return (
    suppliedSignature ===
    expectedSignature
  )
}

function getCookie(
  request,
  name
) {
  const cookieHeader =
    request.headers.get(
      'Cookie'
    )

  if (!cookieHeader) {
    return null
  }

  const cookies =
    cookieHeader.split(';')

  for (
    const cookie of cookies
  ) {
    const [
      key,
      ...valueParts
    ] =
      cookie
        .trim()
        .split('=')

    if (key === name) {
      return valueParts.join('=')
    }
  }

  return null
}

function escapeHtml(value) {
  return value
    .replaceAll(
      '&',
      '&amp;'
    )
    .replaceAll(
      '<',
      '&lt;'
    )
    .replaceAll(
      '>',
      '&gt;'
    )
    .replaceAll(
      '"',
      '&quot;'
    )
    .replaceAll(
      "'",
      '&#039;'
    )
}

function loginPage(
  errorMessage = ''
) {
  const safeError =
    escapeHtml(
      errorMessage
    )

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>R6S Tactics Board</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;

      min-height: 100vh;

      display: flex;
      align-items: center;
      justify-content: center;

      background: #0b0e12;
      color: #ffffff;

      font-family:
        Inter,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    }

    .login-box {
      width: 360px;

      padding: 28px;

      background: #10141a;

      border: 1px solid #303743;
      border-radius: 8px;

      box-shadow:
        0 14px 40px
        rgb(0 0 0 / 40%);
    }

    .title {
      margin: 0;

      font-size: 22px;

      letter-spacing: 2px;
    }

    .subtitle {
      margin-top: 6px;

      color: #727c89;

      font-size: 12px;
    }

    form {
      margin-top: 28px;
    }

    label {
      display: block;

      margin-bottom: 8px;

      color: #9da6b1;

      font-size: 11px;

      letter-spacing: 1.5px;
    }

    input {
      width: 100%;

      padding: 12px;

      background: #1a2028;
      color: #ffffff;

      border: 1px solid #303743;
      border-radius: 5px;

      outline: none;

      font-size: 16px;
    }

    input:focus {
      border-color: #d9a514;
    }

    button {
      width: 100%;

      margin-top: 12px;

      padding: 11px;

      background: #d9a514;
      color: #0d0f12;

      border: 0;
      border-radius: 5px;

      font-weight: bold;

      cursor: pointer;
    }

    button:hover {
      background: #e8ba39;
    }

    .error {
      margin-top: 12px;

      color: #ff7373;

      font-size: 12px;
    }
  </style>
</head>

<body>
  <div class="login-box">

    <h1 class="title">
      R6S TACTICS BOARD
    </h1>

    <div class="subtitle">
      ACCESS REQUIRED
    </div>

    <form
      method="POST"
      action="/__auth"
    >
      <label
        for="passcode"
      >
        PASSCODE
      </label>

      <input
        id="passcode"
        name="passcode"
        type="password"
        autocomplete="current-password"
        required
        autofocus
      >

      <button type="submit">
        ACCESS
      </button>

      ${
        safeError
          ? `<div class="error">${safeError}</div>`
          : ''
      }
    </form>

  </div>
</body>
</html>`
}

export async function onRequest(
  context
) {
  const {
    request,
    env,
  } = context

  const url =
    new URL(
      request.url
    )

  const accessPasscode =
    env.ACCESS_PASSCODE

  const authSecret =
    env.AUTH_SECRET

  if (
    !accessPasscode ||
    !authSecret
  ) {
    return new Response(
      'Authentication secrets are not configured.',
      {
        status: 500,
      }
    )
  }

  /* ========================================
     LOGIN
  ======================================== */

  if (
    url.pathname ===
      '/__auth' &&
    request.method ===
      'POST'
  ) {
    const formData =
      await request.formData()

    const passcode =
      String(
        formData.get(
          'passcode'
        ) ?? ''
      )

    if (
      passcode !==
      accessPasscode
    ) {
      return new Response(
        loginPage(
          'パスコードが違います。'
        ),
        {
          status: 401,

          headers: {
            'Content-Type':
              'text/html; charset=UTF-8',
          },
        }
      )
    }

    const token =
      await createToken(
        authSecret
      )

    return new Response(
      null,
      {
        status: 302,

        headers: {
          Location: '/',

          'Set-Cookie':
            `${COOKIE_NAME}=${token}; ` +
            `Path=/; ` +
            `HttpOnly; ` +
            `Secure; ` +
            `SameSite=Lax; ` +
            `Max-Age=604800`,
        },
      }
    )
  }

  /* ========================================
     AUTH CHECK
  ======================================== */

  const token =
    getCookie(
      request,
      COOKIE_NAME
    )

  const authenticated =
    await verifyToken(
      token,
      authSecret
    )

  if (
    !authenticated
  ) {
    return new Response(
      loginPage(),
      {
        status: 401,

        headers: {
          'Content-Type':
            'text/html; charset=UTF-8',

          'Cache-Control':
            'no-store',
        },
      }
    )
  }

  /* ========================================
     AUTHENTICATED
  ======================================== */

  return context.next()
}