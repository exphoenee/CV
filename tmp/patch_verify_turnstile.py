import re

with open('E:/Projects/GoogleCalendarAPI/Code.gs', 'r', encoding='utf-8') as f:
    content = f.read()

old = '''function verifyTurnstile(token) {
  if (!token) return false;
  var secret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  if (!secret) return false;
  try {
    var res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'post',
      payload: { secret: secret, response: token },
      muteHttpExceptions: true
    });
    var data = JSON.parse(res.getContentText());
    return data.success === true;
  } catch (err) {
    return false;
  }
}'''

new = '''function verifyTurnstile(token) {
  if (!token) { console.log('verifyTurnstile: no token'); return false; }
  var secret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  if (!secret) { console.log('verifyTurnstile: TURNSTILE_SECRET is MISSING from Script Properties'); return false; }
  console.log('verifyTurnstile: secret found, verifying token...');
  try {
    var res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'post',
      payload: { secret: secret, response: token },
      muteHttpExceptions: true
    });
    var data = JSON.parse(res.getContentText());
    console.log('verifyTurnstile response: ' + JSON.stringify(data));
    return data.success === true;
  } catch (err) {
    console.log('verifyTurnstile exception: ' + err.message);
    return false;
  }
}'''

if old in content:
    content = content.replace(old, new)
    with open('E:/Projects/GoogleCalendarAPI/Code.gs', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: verifyTurnstile patched with debug logs')
else:
    print('ERROR: Could not find the exact verifyTurnstile function in the file')
    # Try to find if it exists at all
    if 'function verifyTurnstile' in content:
        print('  Found "function verifyTurnstile" but the exact text did not match')
    else:
        print('  "function verifyTurnstile" not found in file')
