/* ═══════════════════════════════════════════════════════════
   GRABSEL — script.js
   Vanilla JS + Supabase
   ─ Auth (username/password via fake email trick)
   ─ Realtime chat
   ─ Profile pictures (Supabase Storage)
   ─ Country rooms × 3 categories
═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   CONFIG — replace with your Supabase project values
   ══════════════════════════════════════════════════════════ */
const SUPABASE_URL = 'https://duozyzcgqofacmwrorgc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1b3p5emNncW9mYWNtd3JvcmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMTI4OTcsImV4cCI6MjA5NjY4ODg5N30.sUZvMMFdJzBOkyqfCj36Qb9xwucw1RfA_l3d8NuMkdY';


/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: { params: { eventsPerSecond: 10 } },
});

/* ══════════════════════════════════════════════════════════
   COUNTRIES DATA
   ══════════════════════════════════════════════════════════ */
const COUNTRIES = [
  { code:'AF', name:'Afghanistan',       flag:'🇦🇫', continent:'Asia'     },
  { code:'AL', name:'Albania',           flag:'🇦🇱', continent:'Europe'   },
  { code:'DZ', name:'Algeria',           flag:'🇩🇿', continent:'Africa'   },
  { code:'AR', name:'Argentina',         flag:'🇦🇷', continent:'Americas' },
  { code:'AU', name:'Australia',         flag:'🇦🇺', continent:'Oceania'  },
  { code:'AT', name:'Austria',           flag:'🇦🇹', continent:'Europe'   },
  { code:'AZ', name:'Azerbaijan',        flag:'🇦🇿', continent:'Asia'     },
  { code:'BD', name:'Bangladesh',        flag:'🇧🇩', continent:'Asia'     },
  { code:'BE', name:'Belgium',           flag:'🇧🇪', continent:'Europe'   },
  { code:'BO', name:'Bolivia',           flag:'🇧🇴', continent:'Americas' },
  { code:'BA', name:'Bosnia',            flag:'🇧🇦', continent:'Europe'   },
  { code:'BR', name:'Brazil',            flag:'🇧🇷', continent:'Americas' },
  { code:'BG', name:'Bulgaria',          flag:'🇧🇬', continent:'Europe'   },
  { code:'CA', name:'Canada',            flag:'🇨🇦', continent:'Americas' },
  { code:'CL', name:'Chile',             flag:'🇨🇱', continent:'Americas' },
  { code:'CN', name:'China',             flag:'🇨🇳', continent:'Asia'     },
  { code:'CO', name:'Colombia',          flag:'🇨🇴', continent:'Americas' },
  { code:'HR', name:'Croatia',           flag:'🇭🇷', continent:'Europe'   },
  { code:'CU', name:'Cuba',              flag:'🇨🇺', continent:'Americas' },
  { code:'CY', name:'Cyprus',            flag:'🇨🇾', continent:'Europe'   },
  { code:'CZ', name:'Czech Republic',    flag:'🇨🇿', continent:'Europe'   },
  { code:'DK', name:'Denmark',           flag:'🇩🇰', continent:'Europe'   },
  { code:'EG', name:'Egypt',             flag:'🇪🇬', continent:'Africa'   },
  { code:'EE', name:'Estonia',           flag:'🇪🇪', continent:'Europe'   },
  { code:'ET', name:'Ethiopia',          flag:'🇪🇹', continent:'Africa'   },
  { code:'FI', name:'Finland',           flag:'🇫🇮', continent:'Europe'   },
  { code:'FR', name:'France',            flag:'🇫🇷', continent:'Europe'   },
  { code:'GE', name:'Georgia',           flag:'🇬🇪', continent:'Asia'     },
  { code:'DE', name:'Germany',           flag:'🇩🇪', continent:'Europe'   },
  { code:'GH', name:'Ghana',             flag:'🇬🇭', continent:'Africa'   },
  { code:'GR', name:'Greece',            flag:'🇬🇷', continent:'Europe'   },
  { code:'HU', name:'Hungary',           flag:'🇭🇺', continent:'Europe'   },
  { code:'IN', name:'India',             flag:'🇮🇳', continent:'Asia'     },
  { code:'ID', name:'Indonesia',         flag:'🇮🇩', continent:'Asia'     },
  { code:'IR', name:'Iran',              flag:'🇮🇷', continent:'Asia'     },
  { code:'IQ', name:'Iraq',              flag:'🇮🇶', continent:'Asia'     },
  { code:'IE', name:'Ireland',           flag:'🇮🇪', continent:'Europe'   },
  { code:'IL', name:'Israel',            flag:'🇮🇱', continent:'Asia'     },
  { code:'IT', name:'Italy',             flag:'🇮🇹', continent:'Europe'   },
  { code:'JP', name:'Japan',             flag:'🇯🇵', continent:'Asia'     },
  { code:'JO', name:'Jordan',            flag:'🇯🇴', continent:'Asia'     },
  { code:'KZ', name:'Kazakhstan',        flag:'🇰🇿', continent:'Asia'     },
  { code:'KE', name:'Kenya',             flag:'🇰🇪', continent:'Africa'   },
  { code:'KR', name:'South Korea',       flag:'🇰🇷', continent:'Asia'     },
  { code:'KW', name:'Kuwait',            flag:'🇰🇼', continent:'Asia'     },
  { code:'LV', name:'Latvia',            flag:'🇱🇻', continent:'Europe'   },
  { code:'LB', name:'Lebanon',           flag:'🇱🇧', continent:'Asia'     },
  { code:'LT', name:'Lithuania',         flag:'🇱🇹', continent:'Europe'   },
  { code:'MY', name:'Malaysia',          flag:'🇲🇾', continent:'Asia'     },
  { code:'MX', name:'Mexico',            flag:'🇲🇽', continent:'Americas' },
  { code:'MA', name:'Morocco',           flag:'🇲🇦', continent:'Africa'   },
  { code:'NP', name:'Nepal',             flag:'🇳🇵', continent:'Asia'     },
  { code:'NL', name:'Netherlands',       flag:'🇳🇱', continent:'Europe'   },
  { code:'NZ', name:'New Zealand',       flag:'🇳🇿', continent:'Oceania'  },
  { code:'NG', name:'Nigeria',           flag:'🇳🇬', continent:'Africa'   },
  { code:'NO', name:'Norway',            flag:'🇳🇴', continent:'Europe'   },
  { code:'OM', name:'Oman',              flag:'🇴🇲', continent:'Asia'     },
  { code:'PK', name:'Pakistan',          flag:'🇵🇰', continent:'Asia'     },
  { code:'PA', name:'Panama',            flag:'🇵🇦', continent:'Americas' },
  { code:'PE', name:'Peru',              flag:'🇵🇪', continent:'Americas' },
  { code:'PH', name:'Philippines',       flag:'🇵🇭', continent:'Asia'     },
  { code:'PL', name:'Poland',            flag:'🇵🇱', continent:'Europe'   },
  { code:'PT', name:'Portugal',          flag:'🇵🇹', continent:'Europe'   },
  { code:'QA', name:'Qatar',             flag:'🇶🇦', continent:'Asia'     },
  { code:'RO', name:'Romania',           flag:'🇷🇴', continent:'Europe'   },
  { code:'RU', name:'Russia',            flag:'🇷🇺', continent:'Europe'   },
  { code:'SA', name:'Saudi Arabia',      flag:'🇸🇦', continent:'Asia'     },
  { code:'SN', name:'Senegal',           flag:'🇸🇳', continent:'Africa'   },
  { code:'RS', name:'Serbia',            flag:'🇷🇸', continent:'Europe'   },
  { code:'SG', name:'Singapore',         flag:'🇸🇬', continent:'Asia'     },
  { code:'SK', name:'Slovakia',          flag:'🇸🇰', continent:'Europe'   },
  { code:'ZA', name:'South Africa',      flag:'🇿🇦', continent:'Africa'   },
  { code:'ES', name:'Spain',             flag:'🇪🇸', continent:'Europe'   },
  { code:'LK', name:'Sri Lanka',         flag:'🇱🇰', continent:'Asia'     },
  { code:'SE', name:'Sweden',            flag:'🇸🇪', continent:'Europe'   },
  { code:'CH', name:'Switzerland',       flag:'🇨🇭', continent:'Europe'   },
  { code:'TW', name:'Taiwan',            flag:'🇹🇼', continent:'Asia'     },
  { code:'TZ', name:'Tanzania',          flag:'🇹🇿', continent:'Africa'   },
  { code:'TH', name:'Thailand',          flag:'🇹🇭', continent:'Asia'     },
  { code:'TN', name:'Tunisia',           flag:'🇹🇳', continent:'Africa'   },
  { code:'TR', name:'Turkey',            flag:'🇹🇷', continent:'Asia'     },
  { code:'UA', name:'Ukraine',           flag:'🇺🇦', continent:'Europe'   },
  { code:'AE', name:'UAE',               flag:'🇦🇪', continent:'Asia'     },
  { code:'GB', name:'United Kingdom',    flag:'🇬🇧', continent:'Europe'   },
  { code:'US', name:'United States',     flag:'🇺🇸', continent:'Americas' },
  { code:'UY', name:'Uruguay',           flag:'🇺🇾', continent:'Americas' },
  { code:'UZ', name:'Uzbekistan',        flag:'🇺🇿', continent:'Asia'     },
  { code:'VE', name:'Venezuela',         flag:'🇻🇪', continent:'Americas' },
  { code:'VN', name:'Vietnam',           flag:'🇻🇳', continent:'Asia'     },
  { code:'YE', name:'Yemen',             flag:'🇾🇪', continent:'Asia'     },
  { code:'ZM', name:'Zambia',            flag:'🇿🇲', continent:'Africa'   },
  { code:'ZW', name:'Zimbabwe',          flag:'🇿🇼', continent:'Africa'   },
];

const TRENDING = ['US','GB','DE','JP','BR','IN','FR','AU','TR','KR'];

const ROOMS = {
  politics: { label:'Politics', icon:'🏛️' },
  dating:   { label:'Dating',   icon:'💘' },
  gaming:   { label:'Gaming',   icon:'🎮' },
};

const EMOJIS = ['😀','😂','🥰','😎','🤔','😭','😤','🥳','👍','👎',
  '❤️','🔥','💯','✨','😍','🤣','😊','😅','🤯','👀',
  '💪','🙏','🎉','😏','🥺','😈','👻','🌍','🚀','💬'];

/* ══════════════════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════════════════ */
let currentUser   = null;   // Supabase auth user
let currentProfile = null;  // profiles table row
let currentCountry = null;  // { code, name, flag }
let currentRoom    = null;  // 'politics'|'dating'|'gaming'
let currentContinent = 'All';
let realtimeChannel = null; // active Supabase channel
let typingTimeout   = null;
let onlineUsers     = {};   // uid → { username, avatar_url }
let presenceChannel = null;

/* ══════════════════════════════════════════════════════════
   BOOT
   ══════════════════════════════════════════════════════════ */
(async function init() {
  buildCountryGrid();
  buildTrending();
  buildEmojiGrid();

  const { data: { session } } = await sb.auth.getSession();
  if (session) await onSignedIn(session.user);

  sb.auth.onAuthStateChange(async (_event, session) => {
    if (session) await onSignedIn(session.user);
    else onSignedOut();
  });
})();

/* ══════════════════════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════════════════════ */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');

  if (name !== 'chat') leaveChat();
  window.scrollTo(0, 0);
}

/* ══════════════════════════════════════════════════════════
   HOME — COUNTRY GRID
   ══════════════════════════════════════════════════════════ */
function buildCountryGrid(list) {
  const grid = document.getElementById('country-grid');
  const source = list || COUNTRIES.filter(c =>
    currentContinent === 'All' || c.continent === currentContinent
  );
  const empty = document.getElementById('empty-state');

  if (!source.length) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  grid.innerHTML = source.map(c => `
    <div class="country-card" onclick="selectCountry('${c.code}')" title="${c.name}">
      <span class="country-flag">${c.flag}</span>
      <span class="country-name">${c.name}</span>
      <span class="country-continent">${c.continent}</span>
    </div>
  `).join('');
}

function buildTrending() {
  const row = document.getElementById('trending-row');
  row.innerHTML = TRENDING.map(code => {
    const c = COUNTRIES.find(x => x.code === code);
    if (!c) return '';
    return `<div class="trending-chip" onclick="selectCountry('${c.code}')">
      ${c.flag} ${c.name}
    </div>`;
  }).join('');
}

function filterCountries(query) {
  const q = query.trim().toLowerCase();
  const clearBtn = document.getElementById('search-clear');
  clearBtn.classList.toggle('hidden', !q);

  if (!q) { buildCountryGrid(); return; }
  const results = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
  );
  document.getElementById('empty-query').textContent = query;
  buildCountryGrid(results);
}

function clearSearch() {
  document.getElementById('search-input').value = '';
  filterCountries('');
}

function filterContinent(continent, btn) {
  currentContinent = continent;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  buildCountryGrid();
}

/* ══════════════════════════════════════════════════════════
   COUNTRY PAGE
   ══════════════════════════════════════════════════════════ */
function selectCountry(code) {
  const c = COUNTRIES.find(x => x.code === code);
  if (!c) return;
  currentCountry = c;
  document.getElementById('country-flag-big').textContent = c.flag;
  document.getElementById('country-name-big').textContent = c.name;
  showPage('country');
}

/* ══════════════════════════════════════════════════════════
   CHAT
   ══════════════════════════════════════════════════════════ */
function openRoom(room) {
  currentRoom = room;
  const info = ROOMS[room];

  document.getElementById('chat-room-icon').textContent  = info.icon;
  document.getElementById('chat-room-name').textContent  = info.label;
  document.getElementById('chat-country-tag').textContent = currentCountry.flag + ' ' + currentCountry.name;
  document.getElementById('sidebar-room-badge').textContent = info.icon + ' ' + info.label;
  document.title = `${currentCountry.name} — ${info.label} | Grabsel`;

  showPage('chat');
  document.getElementById('messages').innerHTML = '';

  loadMessages();
  subscribeRealtime();
  subscribePresence();
}

async function loadMessages() {
  const channel = roomId();
  const { data, error } = await sb
  .from('messages')
  .select('*')
  .eq('room', channel)
  .order('created_at', { ascending: true })
  .limit(80);

  if (error) { console.error(error); return; }
  const wrap = document.getElementById('messages');
  wrap.innerHTML = '';
  (data || []).forEach(msg => appendMessage(msg));
  scrollToBottom();
}

function subscribeRealtime() {
  leaveChat();

  realtimeChannel = sb.channel(`room:${roomId()}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `room=eq.${roomId()}`,
    }, async (payload) => {
      // Fetch profile for the new message
      const { data: profile } = await sb
        .from('profiles')
        .select('username, avatar_url, display_name, social_links')
        .eq('id', payload.new.user_id)
        .single();
      payload.new.profiles = profile;
      appendMessage(payload.new);
      scrollToBottom();
    })
    .on('broadcast', { event: 'typing' }, ({ payload }) => {
      if (payload.user_id !== currentUser?.id) showTyping(payload.username);
    })
    .subscribe();
}

function subscribePresence() {
  if (presenceChannel) sb.removeChannel(presenceChannel);

  const ch = sb.channel(`presence:${roomId()}`, {
    config: { presence: { key:
  currentLinkedProfileId ||
  currentUser?.id ||
  ('anon_' + Math.random()) } },
  });

  ch.on('presence', { event: 'sync' }, () => {
    onlineUsers = {};
    const state = ch.presenceState();
    Object.values(state).flat().forEach(p => {
      if (p.user_id) onlineUsers[p.user_id] = p;
    });
    renderOnlineUsers();
    updateOnlineCount();
  });

  if (currentUser && currentProfile) {
    ch.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await ch.track({
          user_id:
  currentLinkedProfileId ||
  currentUser.id,
          username:   currentProfile.username,
          avatar_url: currentProfile.avatar_url,
          online_at:  new Date().toISOString(),
        });
      }
    });
  } else {
    ch.subscribe();
  }
  presenceChannel = ch;
}

function leaveChat() {
  if (realtimeChannel) { sb.removeChannel(realtimeChannel); realtimeChannel = null; }
  if (presenceChannel) { sb.removeChannel(presenceChannel); presenceChannel = null; }
}

function roomId() {
  return `${currentCountry.code.toLowerCase()}-${currentRoom}`;
}

/* ── Append message to DOM ─────────────────────────────── */
function appendMessage(msg) {
  const wrap = document.getElementById('messages');
  const p = msg.profiles || {};
  const username  = p.username    || 'user';
  const dispName  = p.display_name || username;
  const avatarUrl = p.avatar_url   || null;
  const time = formatTime(msg.created_at);
  const userId = msg.user_id;

  const el = document.createElement('div');
  el.className = 'msg';
  el.dataset.userId = userId;

  const avatarHtml = avatarUrl
    ? `<img class="msg-avatar" src="${escHtml(avatarUrl)}" alt="" loading="lazy" />`
    : `<div class="msg-avatar-fallback">${escHtml(dispName[0].toUpperCase())}</div>`;

  el.innerHTML = `
    <div class="msg-avatar-wrap" onclick="openUserPopup(event, '${escHtml(userId)}')">
      ${avatarHtml}
    </div>
    <div class="msg-body">
      <div class="msg-header">
        <span class="msg-author" onclick="openUserPopup(event, '${escHtml(userId)}')">${escHtml(dispName)}</span>
        <span class="msg-time">${time}</span>
      </div>
      <div class="msg-text">${escHtml(msg.content)}</div>
    </div>
  `;
  wrap.appendChild(el);
}

/* ── Send message ─────────────────────────────────────── */
async function sendMessage() {
  if (!currentUser) {
    document.getElementById('auth-banner').classList.remove('hidden');
    setTimeout(() =>
      document.getElementById('auth-banner').classList.add('hidden'),
      4000
    );
    return;
  }

  const input = document.getElementById('chat-input');
  const content = input.value.trim();

  if (!content) return;

  input.value = '';
  closeEmojiPicker();

  const realUserId = currentLinkedProfileId || currentUser.id;

  const { error } = await sb
    .from('messages')
    .insert({
      room: roomId(),
      user_id: realUserId,
      content
    });

  if (error) {
    console.error('Send failed:', error);
  }
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

/* ── Typing indicator ─────────────────────────────────── */
let typingVisible = false;

async function handleTyping() {
  if (!currentUser || !realtimeChannel) return;
  clearTimeout(typingTimeout);
  realtimeChannel.send({
    type: 'broadcast', event: 'typing',
    payload: { user_id: currentUser.id, username: currentProfile?.username || 'someone' },
  });
  typingTimeout = setTimeout(clearTyping, 2500);
}

function showTyping(username) {
  const area = document.getElementById('typing-area');
  area.innerHTML = `
    <div class="typing-indicator">
      <div class="typing-dots">
        <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
      </div>
      <span class="typing-text">${escHtml(username)} is typing…</span>
    </div>`;
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(clearTyping, 2500);
}

function clearTyping() {
  document.getElementById('typing-area').innerHTML = '';
}

/* ── Online users ─────────────────────────────────────── */
function renderOnlineUsers() {
  const list = document.getElementById('online-list');
  const users = Object.values(onlineUsers);
  if (!users.length) { list.innerHTML = '<p style="font-size:12px;color:var(--text-3)">No one online yet</p>'; return; }
  list.innerHTML = users.map(u => {
    const avatar = u.avatar_url
      ? `<img class="online-avatar-img" src="${escHtml(u.avatar_url)}" alt="" />`
      : `<div class="online-avatar-fallback">${escHtml((u.username||'?')[0].toUpperCase())}</div>`;
    return `
      <div class="online-user-item" onclick="openUserPopupById(event, '${escHtml(u.user_id)}')">
        <div class="online-avatar-wrap">${avatar}<div class="online-dot"></div></div>
        <span class="online-name">${escHtml(u.username || 'user')}</span>
      </div>`;
  }).join('');
}

function updateOnlineCount() {
  const n = Object.keys(onlineUsers).length;
  document.getElementById('online-count-badge').textContent = `● ${n} online`;
}

/* ── Scroll ───────────────────────────────────────────── */
function scrollToBottom() {
  const wrap = document.getElementById('messages-wrap');
  wrap.scrollTop = wrap.scrollHeight;
}

/* ── Sidebar toggle (mobile) ─────────────────────────── */
function toggleSidebar() {
  document.getElementById('chat-sidebar').classList.toggle('open');
}

/* ══════════════════════════════════════════════════════════
   EMOJI PICKER
   ══════════════════════════════════════════════════════════ */
function buildEmojiGrid() {
  const grid = document.getElementById('emoji-grid');
  grid.innerHTML = EMOJIS.map(e =>
    `<div class="emoji-item" onclick="insertEmoji('${e}')">${e}</div>`
  ).join('');
}

function toggleEmojiPicker() {
  document.getElementById('emoji-picker-wrap').classList.toggle('hidden');
}

function closeEmojiPicker() {
  document.getElementById('emoji-picker-wrap').classList.add('hidden');
}

function insertEmoji(emoji) {
  const input = document.getElementById('chat-input');
  input.value += emoji;
  input.focus();
  closeEmojiPicker();
}

document.addEventListener('click', e => {
  const picker = document.getElementById('emoji-picker-wrap');
  const btn    = document.getElementById('emoji-btn');
  if (!picker.classList.contains('hidden') && !picker.contains(e.target) && e.target !== btn) {
    closeEmojiPicker();
  }
  // Close nav dropdown
  const dd  = document.getElementById('nav-dropdown');
  const nav = document.getElementById('nav-avatar-btn');
  if (dd && !dd.classList.contains('hidden') && !nav.contains(e.target)) {
    dd.classList.add('hidden');
  }
});

/* ══════════════════════════════════════════════════════════
   USER POPUP
   ══════════════════════════════════════════════════════════ */
async function openUserPopup(event, userId) {
  event.stopPropagation();
  if (!userId) return;

  const { data: profile } = await sb
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  renderUserPopup(event, profile);
}

async function openUserPopupById(event, userId) {
  openUserPopup(event, userId);
}

function renderUserPopup(event, profile) {
  if (!profile) return;
  const popup = document.getElementById('user-popup');
  const avatarImg = document.getElementById('popup-avatar');
  const avatarFb  = document.getElementById('popup-avatar-fallback');
  const name      = profile.display_name || profile.username || 'User';

  if (profile.avatar_url) {
    avatarImg.src = profile.avatar_url;
    avatarImg.classList.remove('hidden');
    avatarFb.classList.add('hidden');
  } else {
    avatarFb.textContent = name[0].toUpperCase();
    avatarFb.classList.remove('hidden');
    avatarImg.classList.add('hidden');
  }

  document.getElementById('popup-name').textContent     = name;
  document.getElementById('popup-username').textContent = '@' + (profile.username || '');

  const links = profile.social_links || {};
  const linksEl = document.getElementById('popup-links');
  linksEl.innerHTML = '';

  const socials = [
    { key:'twitter',   icon:'𝕏', label:'Twitter',   href: h => `https://twitter.com/${h.replace('@','')}` },
    { key:'instagram', icon:'📸', label:'Instagram', href: h => `https://instagram.com/${h.replace('@','')}` },
    { key:'discord',   icon:'💬', label:'Discord',   href: () => null },
    { key:'website',   icon:'🌐', label:'Website',   href: h => h },
  ];

  socials.forEach(s => {
    const val = links[s.key];
    if (!val) return;
    const url = s.href(val);
    const el  = document.createElement('a');
    el.className   = 'popup-link';
    el.textContent = `${s.icon} ${val}`;
    if (url) { el.href = url; el.target = '_blank'; el.rel = 'noopener'; }
    linksEl.appendChild(el);
  });

  if (!linksEl.children.length) {
    linksEl.innerHTML = '<p style="font-size:12px;color:var(--text-3);text-align:center">No social links</p>';
  }

  // Position near click
  popup.classList.remove('hidden');
  const rect = { x: event.clientX, y: event.clientY };
  let top  = rect.y + window.scrollY - 10;
  let left = rect.x + 10;
  if (left + 230 > window.innerWidth)  left  = rect.x - 230;
  if (top  + 320 > window.scrollY + window.innerHeight) top = top - 280;
  popup.style.top  = top  + 'px';
  popup.style.left = left + 'px';
}

function closeUserPopup() {
  document.getElementById('user-popup').classList.add('hidden');
}

document.addEventListener('click', e => {
  const popup = document.getElementById('user-popup');
  if (!popup.classList.contains('hidden') && !popup.contains(e.target)) {
    closeUserPopup();
  }
});

/* ══════════════════════════════════════════════════════════
   AUTH
   ────────────────────────────────────────────────────────
   Strategy: NO email is ever sent.
   • Signup  → signInAnonymously() to get a Supabase session,
               then store username + hashed password in profiles.
   • Login   → look up profile by username, verify password
               hash with Web Crypto, then call
               signInAnonymously() and link the profile uid.
   • Session → stored in localStorage by Supabase SDK.
               On reload we restore the session and re-link
               currentProfile by matching the stored uid.

   Password hashing: SHA-256 via Web Crypto (built into every
   modern browser — no library needed).
   ══════════════════════════════════════════════════════════ */

async function sha256(str) {
  const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

async function handleSignup(e) {
  e.preventDefault();
  const name  = document.getElementById('signup-name').value.trim();
  const user  = document.getElementById('signup-username').value.trim().toLowerCase();
  const pass  = document.getElementById('signup-password').value;
  const errEl = document.getElementById('signup-error');
  const btn   = document.getElementById('signup-submit');

  errEl.classList.add('hidden');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled  = true;

  try {
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(user)) throw new Error('Username must be 3–20 letters, numbers or underscores.');
    if (pass.length < 6) throw new Error('Password must be at least 6 characters.');

    // 1. Check username is free
    const { data: existing } = await sb
      .from('profiles').select('id').eq('username', user).maybeSingle();
    if (existing) throw new Error('Username already taken — try another.');

    // 2. Get an anonymous Supabase session (zero emails, zero rate limits)
    const { data: anonData, error: anonErr } = await sb.auth.signInAnonymously();
    if (anonErr) throw anonErr;
    const uid = anonData.user.id;

    // 3. Hash password and save profile
    const pwHash = await sha256(pass + uid);   // uid as salt
    const { error: insErr } = await sb.from('profiles').insert({
      id:           uid,
      username:     user,
      display_name: name,
      pw_hash:      pwHash,
      avatar_url:   null,
      social_links: {},
    });
    if (insErr) throw insErr;

    await onSignedIn(anonData.user);
    closeAllModals();
  } catch (err) {
    // If profile insert failed, clean up the dangling anon session
    await sb.auth.signOut().catch(() => {});
    showError('signup-error', err.message);
  } finally {
    btn.innerHTML = 'Create account';
    btn.disabled  = false;
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const user  = document.getElementById('login-username').value.trim().toLowerCase();
  const pass  = document.getElementById('login-password').value;
  const btn   = document.getElementById('login-submit');

  document.getElementById('login-error').classList.add('hidden');
  btn.innerHTML = '<span class="spinner"></span>';
  btn.disabled  = true;

  try {
    // 1. Look up profile by username
    const { data: profile, error: fetchErr } = await sb
      .from('profiles').select('id, pw_hash').eq('username', user).maybeSingle();
    if (fetchErr || !profile) throw new Error('Wrong username or password.');

    // 2. Verify password hash
    const pwHash = await sha256(pass + profile.id);
    if (pwHash !== profile.pw_hash) throw new Error('Wrong username or password.');

    // 3. Sign in anonymously — then immediately swap the session uid
    //    to the stored profile uid using a custom claim stored in metadata.
    //    Because anonymous users get a fresh uid each time, we persist the
    //    mapping: after signing in anonymously we update our local state to
    //    point at the real profile row by id.
    const { data: anonData, error: anonErr } = await sb.auth.signInAnonymously();
    if (anonErr) throw anonErr;

    // 4. Re-link: update the anon user's profile pointer so presence/messages
    //    use the *original* profile id. We do this by storing the real uid in
    //    app metadata and remapping currentUser.id in our app state.
    currentLinkedProfileId = profile.id;

localStorage.setItem(
  'linkedProfileId',
  profile.id
);

    await onSignedIn(anonData.user);
    closeAllModals();
  } catch (err) {
    showError('login-error', err.message);
  } finally {
    btn.innerHTML = 'Log in';
    btn.disabled  = false;
  }
}

// When a returning user logs in we map their anon session → their real profile.
// This variable holds that override so all db writes use the correct profile id.
let currentLinkedProfileId =
  localStorage.getItem('linkedProfileId');

async function signOut() {
  localStorage.removeItem('linkedProfileId');
  currentLinkedProfileId = null;

  await sb.auth.signOut();

  document
    .getElementById('nav-dropdown')
    .classList.add('hidden');

  showPage('home');
}

async function onSignedIn(user) {
  currentUser = user;

  let profile = null;

  if (currentLinkedProfileId) {
    const { data } = await sb
      .from('profiles')
      .select('*')
      .eq('id', currentLinkedProfileId)
      .single();

    profile = data;
  } else {
    const { data } = await sb
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    profile = data;
  }

  currentProfile = profile;
  updateNavUser();
}

function onSignedOut() {
  currentUser    = null;
  currentProfile = null;
  updateNavUser();
}

function updateNavUser() {
  const authBtns = document.getElementById('nav-auth-btns');
  const navUser  = document.getElementById('nav-user');

  if (currentUser && currentProfile) {
    authBtns.classList.add('hidden');
    navUser.classList.remove('hidden');
    document.getElementById('nav-username-text').textContent = currentProfile.display_name || currentProfile.username;
    setNavAvatar();
  } else {
    authBtns.classList.remove('hidden');
    navUser.classList.add('hidden');
  }
}

function setNavAvatar() {
  const img = document.getElementById('nav-avatar');
  const fb  = document.getElementById('nav-avatar-fallback');
  if (currentProfile?.avatar_url) {
    img.src = currentProfile.avatar_url;
    img.classList.remove('hidden');
    fb.classList.add('hidden');
  } else {
    const name = currentProfile?.display_name || currentProfile?.username || '?';
    fb.textContent = name[0].toUpperCase();
    fb.classList.remove('hidden');
    img.classList.add('hidden');
  }
}

// Nav dropdown toggle
document.getElementById('nav-avatar-btn').addEventListener('click', e => {
  e.stopPropagation();
  document.getElementById('nav-dropdown').classList.toggle('hidden');
});

/* ══════════════════════════════════════════════════════════
   PROFILE SETTINGS
   ══════════════════════════════════════════════════════════ */
function showProfileSettings() {
  if (!currentProfile) return;
  document.getElementById('nav-dropdown').classList.add('hidden');

  const p = currentProfile;
  document.getElementById('profile-name').value      = p.display_name || '';
  document.getElementById('profile-twitter').value   = p.social_links?.twitter   || '';
  document.getElementById('profile-instagram').value = p.social_links?.instagram || '';
  document.getElementById('profile-discord').value   = p.social_links?.discord   || '';
  document.getElementById('profile-website').value   = p.social_links?.website   || '';

  const preview = document.getElementById('profile-preview');
  const fb      = document.getElementById('profile-avatar-fallback');
  if (p.avatar_url) {
    preview.src = p.avatar_url;
    preview.classList.remove('hidden');
    fb.classList.add('hidden');
  } else {
    fb.textContent = (p.display_name || p.username || '?')[0].toUpperCase();
    fb.classList.remove('hidden');
    preview.classList.add('hidden');
  }

  showModal('profile');
}

async function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file || !currentUser) return;
  if (file.size > 2 * 1024 * 1024) { showError('profile-error', 'Image must be under 2 MB.'); return; }

  // Preview locally first
  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('profile-preview');
    const fb      = document.getElementById('profile-avatar-fallback');
    preview.src = e.target.result;
    preview.classList.remove('hidden');
    fb.classList.add('hidden');
  };
  reader.readAsDataURL(file);

  // Upload to Supabase Storage
  const ext  = file.name.split('.').pop();
  const path = `avatars/${currentUser.id}.${ext}`;

  const { error: upErr } = await sb.storage.from('avatars').upload(path, file, { upsert: true });
  if (upErr) { showError('profile-error', 'Upload failed: ' + upErr.message); return; }

  const { data: urlData } = sb.storage.from('avatars').getPublicUrl(path);
  const avatarUrl = urlData.publicUrl + '?t=' + Date.now();

  await sb.from('profiles').update({ avatar_url: avatarUrl }).eq(
  'id',
  currentLinkedProfileId || currentUser.id
);
  currentProfile.avatar_url = avatarUrl;
  setNavAvatar();
}

async function saveProfile() {
  if (!currentUser) return;
  const errEl = document.getElementById('profile-error');
  errEl.classList.add('hidden');

  const updates = {
    display_name: document.getElementById('profile-name').value.trim(),
    social_links: {
      twitter:   document.getElementById('profile-twitter').value.trim(),
      instagram: document.getElementById('profile-instagram').value.trim(),
      discord:   document.getElementById('profile-discord').value.trim(),
      website:   document.getElementById('profile-website').value.trim(),
    },
  };

  // Remove empty social links
  Object.keys(updates.social_links).forEach(k => {
    if (!updates.social_links[k]) delete updates.social_links[k];
  });

  const { error } = await sb.from('profiles').update(updates).eq(
  'id',
  currentLinkedProfileId || currentUser.id
);
  if (error) { showError('profile-error', error.message); return; }

  currentProfile = { ...currentProfile, ...updates };
  updateNavUser();
  closeAllModals();
}

/* ══════════════════════════════════════════════════════════
   MODAL HELPERS
   ══════════════════════════════════════════════════════════ */
function showModal(name) {
  closeAllModals();
  document.getElementById('modal-backdrop').classList.remove('hidden');
  document.getElementById(`modal-${name}`).classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeAllModals() {
  document.getElementById('modal-backdrop').classList.add('hidden');
  ['login','signup','profile'].forEach(n => {
    document.getElementById(`modal-${n}`)?.classList.add('hidden');
  });
  document.body.style.overflow = '';
}

// ESC closes modals
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeAllModals();
    closeUserPopup();
    closeEmojiPicker();
  }
});

/* ══════════════════════════════════════════════════════════
   UTILS
   ══════════════════════════════════════════════════════════ */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const h = d.getHours().toString().padStart(2,'0');
  const m = d.getMinutes().toString().padStart(2,'0');
  if (isToday) return `Today at ${h}:${m}`;
  const mo = (d.getMonth()+1).toString().padStart(2,'0');
  const dy = d.getDate().toString().padStart(2,'0');
  return `${dy}/${mo} ${h}:${m}`;
}

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.remove('hidden');
}
