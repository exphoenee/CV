import { escHtml } from '../../../shared.js';
import { swgGet } from '../ui/endpoint-block.js';
import { swgTagSection } from '../ui/tag-section.js';

export function renderIdentitySection(data) {
  var E = escHtml;
  var identityEndpoints = [];

  var profileResp = '<p class="cv-kv"><code>name</code>' + E(data.identity.name) + '</p><p class="cv-kv"><code>role</code>' + E(data.identity.role) + ' <em>// "Developer" is an understatement</em></p><p class="cv-kv"><code>location</code>' + E(data.identity.location) + '</p><p class="cv-kv"><code>accentColor</code>' + E(data.meta.accentColor) + ' <span class="cv-color-dot"></span></p><p class="cv-kv"><code>deprecated</code>false <em>// still actively maintained</em></p>';
  identityEndpoints.push(swgGet('identity', 'get_identity_profile', '/identity/profile', 'Name, role, location', '<p>Returns the developer\'s core identity fields.</p>', null, [{code: '200', bodyHtml: profileResp, linksHtml: 'No links'}]));

  var contactResp = '';
  var contactMap = {email: null, phone: null, github: null, linkedin: null, website: null};
  data.identity.contacts.forEach(function (c) {
    var label = c.label;
    if (label.indexOf('@') > -1) contactMap.email = c;
    else if (label.indexOf('+36') > -1) contactMap.phone = c;
    else if (label.indexOf('github') > -1) contactMap.github = c;
    else if (label.indexOf('linkedin') > -1) contactMap.linkedin = c;
    else if (label.indexOf('bozzayviktor') > -1) contactMap.website = c;
  });
  var contactEntries = [
    {key: 'email', comment: null},
    {key: 'phone', comment: null},
    {key: 'github', comment: '// phoenix, with extra e\'s'},
    {key: 'linkedin', comment: null},
    {key: 'website', comment: null}
  ];
  contactEntries.forEach(function (entry) {
    var c = contactMap[entry.key];
    if (c && c.url) {
      var href = entry.key === 'email' ? 'mailto:' + c.label : (entry.key === 'phone' ? 'tel:' + c.label : c.url);
      var comment = entry.comment ? ' <em>' + entry.comment + '</em>' : '';
      contactResp += '<p class="cv-kv"><code>' + entry.key + '</code><a href="' + href + '">' + E(c.label) + '</a>' + comment + '</p>';
    }
  });
  identityEndpoints.push(swgGet('identity', 'get_identity_contact', '/identity/contact', 'All contact channels', '<p>Returns all available contact channels.</p>', null, [{code: '200', bodyHtml: contactResp, linksHtml: 'No links'}]));

  var langResp = '';
  var langComments = {
    'Hungarian': 'no runtime errors',
    'German': 'can order Schnitzel and read stack traces',
    'English': 'you\'re reading this - proof it works'
  };
  data.identity.languages.forEach(function (l) {
    var comment = langComments[l.name] ? ' <em>// ' + langComments[l.name] + '</em>' : '';
    langResp += '<p class="cv-kv"><code>' + E(l.name) + '</code>' + E(l.level.toLowerCase()) + comment + '</p>';
  });
  identityEndpoints.push(swgGet('identity', 'get_identity_languages', '/identity/languages', 'Spoken language proficiencies', '<p>Returns spoken language proficiencies.</p>', null, [{code: '200', bodyHtml: langResp, linksHtml: 'No links'}]));

  return swgTagSection('identity', identityEndpoints.join(''));
}
