// const API_HOST = 'http://localhost:9090';
const API_HOST = 'http://pico.ossrv.nl:9090';

function byId(id) {
  return document.getElementById(id);
}

const pNumber = byId('phone_number');
const pswd = byId('pswd');
const loginError = byId('login_error');
const loginDiv = byId('login_div');
const currentPositionDiv = byId('current_position_div');
const longitudeElt = byId('longitude');
const latitudeElt = byId('latitude');
const labelDiv = byId('label_div');
const alarmsDiv = byId('alarms_div');
const alarmsTable = byId('alarms_table');
const citizenInfoDiv = byId('citizen_info_div');
const citizenImage = byId('citizen_image');
const citizenName = byId('citizen_name');
const citizenLatitude = byId('citizen_latitude');
const citizenLongitude = byId('citizen_longitude');
const feedbackDiv = byId('feedback_div');
const feedbackTable = byId('feedback_table');
const staticPosition = [
  { latitude: 33.698424, longitude: -7.383894 },
  { latitude: 33.698638, longitude: -7.383121 },
  { latitude: 33.699495, longitude: -7.381619 },
  { latitude: 33.699923, longitude: -7.380546 },
  { latitude: 33.700602, longitude: -7.379345 },
  { latitude: 33.700995, longitude: -7.378358 },
  { latitude: 33.701352, longitude: -7.377757 },
  { latitude: 33.701637, longitude: -7.377070 },
  { latitude: 33.701887, longitude: -7.376298 },
  { latitude: 33.702244, longitude: -7.375568 },
  { latitude: 33.703743, longitude: -7.372049 },
  { latitude: 33.703993, longitude: -7.371319 },
  { latitude: 33.704243, longitude: -7.370676 },
  { latitude: 33.704993, longitude: -7.369130 },
  { latitude: 33.705957, longitude: -7.366341 },
  { latitude: 33.706349, longitude: -7.365225 },
  { latitude: 33.706420, longitude: -7.363980 },
  { latitude: 33.706349, longitude: -7.363293 },
  { latitude: 33.706206, longitude: -7.362006 },
  { latitude: 33.705991, longitude: -7.359130 },
  { latitude: 33.705741, longitude: -7.357842 },
  { latitude: 33.705703, longitude: -7.357112 },
  { latitude: 33.705317, longitude: -7.356924 },
  { latitude: 33.704996, longitude: -7.357374 },
  { latitude: 33.703710, longitude: -7.358404 },
  { latitude: 33.703050, longitude: -7.359188 },
  { latitude: 33.702550, longitude: -7.359928 },
  { latitude: 33.702104, longitude: -7.360411 },
  { latitude: 33.701702, longitude: -7.360936 },
  { latitude: 33.701184, longitude: -7.361537 },
  { latitude: 33.700765, longitude: -7.362127 },
  { latitude: 33.700453, longitude: -7.362449 },
  { latitude: 33.700301, longitude: -7.362664 }
];
let currentPositionIndex = 0;
let currentAlarmId;

let tokenVar = localStorage.getItem('driver_token');
let socket;

/* function initPositionTimer() {
  currentPositionDiv.className = 'visible';
  setInterval(() => {
    const message = {
      longitude: Math.random() * 100000,
      latitude: Math.random() * 100000
    };

    longitudeElt.innerHTML = message.longitude;
    latitudeElt.innerHTML = message.latitude;

    socket.emit('POSITION_CHANGE_EVENT', message);
  }, 5000);
} */

function initPositionTimer() {
  currentPositionDiv.className = 'visible';
  setInterval(() => {
    if (currentPositionIndex === staticPosition.length) {
      currentPositionIndex = 0;
      return;
    }
    const message = {
      latitude: staticPosition[currentPositionIndex].latitude,
      longitude: staticPosition[currentPositionIndex].longitude,
    };

    longitudeElt.innerHTML = message.longitude;
    latitudeElt.innerHTML = message.latitude;

    currentPositionIndex += 1;
    socket.emit('POSITION_CHANGE_EVENT', message);
  }, 2000);
}
function main() {
  labelDiv.className = 'visible';
  labelDiv.innerHTML = '<b>Waiting for citizens alarms</b>';
}

function createCitizenPicture(citizenId) {
  const img = document.createElement('IMG');
  img.setAttribute('src', `${API_HOST}/api/citizens/image/${citizenId}.jpg`);
  img.setAttribute('width', '300');
  return img;
}

function createApproveButton(alarmId, citizenId, fullName,
  citizenLatitudeVal, citizenLongitudeVal) {
  const btn = document.createElement('BUTTON');
  const t = document.createTextNode('Approve');
  btn.appendChild(t);
  btn.onclick = () => {
    currentAlarmId = alarmId;
    socket.emit('ACCEPTED_REQUEST_EVENT', { alarm_id: alarmId });
    alarmsDiv.className = 'hidden';
    citizenInfoDiv.className = 'visible';
    citizenImage.appendChild(createCitizenPicture(citizenId));
    citizenName.innerHTML = fullName;
    citizenLatitude.innerHTML = citizenLatitudeVal;
    citizenLongitude.innerHTML = citizenLongitudeVal;
  };

  return btn;
}

function createRejectButton(alarmId) {
  const btn = document.createElement('BUTTON');
  const t = document.createTextNode('Reject');
  btn.appendChild(t);
  btn.onclick = () => {
    socket.emit('REJECTED_REQUEST_EVENT', { alarm_id: alarmId });
    // remove row
    const row = byId(alarmId);
    row.parentNode.removeChild(row);
  };
  return btn;
}

/* Socket.io handler */
function newAlarmEventHandler(data) {
  console.log('NEW_ALARM_EVENT');
  alarmsDiv.className = 'visible';
  labelDiv.className = 'hidden';

  const row = alarmsTable.insertRow(-1);
  row.setAttribute('id', data.alarm_id);

  const citizenPicture = row.insertCell(0);
  const name = row.insertCell(1);
  const latitude = row.insertCell(2);
  const longitude = row.insertCell(3);
  const approve = row.insertCell(4);
  const reject = row.insertCell(5);

  citizenPicture.appendChild(createCitizenPicture(data.citizen_id));
  approve.appendChild(
    createApproveButton(data.alarm_id, data.citizen_id, data.full_name,
      data.latitude, data.longitude)
  );
  reject.appendChild(createRejectButton(data.alarm_id));

  name.innerHTML = data.full_name;
  latitude.innerHTML = data.latitude;
  longitude.innerHTML = data.longitude;
}

function citizenPositionChangeHandler(data) {
  citizenLatitude.innerHTML = data.latitude;
  citizenLongitude.innerHTML = data.longitude;
}

function newFeedbackHandler(data) {
  feedbackDiv.className = 'visible';
  const row = feedbackTable.insertRow(-1);
  const citizenPicture = row.insertCell(0);
  const percentage = row.insertCell(1);
  const comment = row.insertCell(2);

  citizenPicture.appendChild(createCitizenPicture(data.citizen_id));
  percentage.innerHTML = data.percentage;
  comment.innerHTML = data.comment;
}

function cancelAlarmHandler(data) {
  const row = byId(data.alarm_id);
  if (row) { row.parentNode.removeChild(row); } else console.error('Unappropriate Alarm ID');
}

function initSocket() {
  socket = io(`${API_HOST}?userType=DRIVER_SOCKET_TYPE`);

  socket.on('NEW_ALARM_EVENT', newAlarmEventHandler);
  socket.on('CITIZEN_POSITION_CHANGE_EVENT', citizenPositionChangeHandler);
  socket.on('CITIZEN_FEEDBACK_EVENT', newFeedbackHandler);
  socket.on('CANCEL_ALARM_EVENT', cancelAlarmHandler);

  socket.on('BAD_REQUEST_EVENT', () => console.log('BAD_REQUEST_EVENT'));
  socket.on('SUCCESSFUL_FAKE_ALARM_DECLARATION_EVENT', () => console.log('SUCCESSFUL_FAKE_ALARM_DECLARATION_EVENT'));
  socket.on('ALARM_NOT_FOUND_EVENT', () => console.log('ALARM_NOT_FOUND_EVENT'));
  socket.on('UNAUTHORIZED_MISSION_COMPLETION_EVENT', () => console.log('UNAUTHORIZED_MISSION_COMPLETION_EVENT'));

  socket.on('DRIVER_AUTH_SUCCESS_EVENT', () => {
    initPositionTimer();
    main();
  });

  socket.on('connect', () => {
    socket.emit('DRIVER_AUNTENTICATION_EVENT', { token: tokenVar });
  });
}

/* DOM event handlers */
function login() {
  loginError.innerHTML = null;
  const data = JSON.stringify({
    phone_number: pNumber.value,
    password: pswd.value
  });

  if (tokenVar) {
    loginDiv.className = 'hidden';
    return initSocket();
  }

  fetch(`${API_HOST}/api/drivers/signin`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    })
    .then(response => response.json())
    .then((jsonResponse) => {
      if (!jsonResponse.success) {
        loginError.innerHTML = jsonResponse.msg;
        return;
      }

      tokenVar = jsonResponse.token;
      localStorage.setItem('driver_token', tokenVar);
      loginDiv.className = 'hidden';
      initSocket();
    })
    .catch((err) => {
      console.log('err :');
      console.log(err);
    });
}

function removeToken() {
  localStorage.removeItem('driver_token');
}

function missionAccomplished() {
  if (currentAlarmId) {
    socket.emit('MISSION_ACCOMPLISHED_EVENT', { alarm_id: currentAlarmId });
    citizenInfoDiv.className = 'hidden';
    main();
  } else { console.error('Invalid alarm ID : missionAccomplished'); }
}

function fakeAlarm() {
  if (currentAlarmId) {
    socket.emit('FAKE_ALARM_EVENT', { alarm_id: currentAlarmId });
    citizenInfoDiv.className = 'hidden';
    main();
  } else { console.error('Invalid alarm ID : fakeAlarm'); }
}

if (tokenVar) {
  loginDiv.className = 'hidden';
  initSocket();
}
