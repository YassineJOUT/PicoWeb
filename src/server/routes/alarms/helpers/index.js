const GenericDAO = require('../../../dao/genericDAO');
const Ambulance = require('../../../bo/ambulance.bo');
const getToken = require('../../../helpers/getToken');
const { matchSocketToToken } = require('../../../web-sockets/index');

const AMBULANCE_NOT_FOUND = 'Ambulance not found';
const SOCKET_ERROR = 'wrong socket ID';


function checkAmbulanceAvailabilty(request, response) {
  return new Promise((resolve) => {
    GenericDAO.findOne(Ambulance, { id: request.body.ambulance_id },
      (err, ambulance) => {
        if (err || !ambulance || !(ambulance.available)) {
          return response.status(400).send({ success: false, msg: AMBULANCE_NOT_FOUND });
        }

        return resolve();
      });
  });
}

function checkSocketID(request, response) {
  return new Promise(() => {
    const socketId = request.body.socket_id;
    const token = getToken(request.headers);

    return matchSocketToToken(socketId, token)
      // .then(socket => resolve(socket))
      .catch(() => response.status(401).send({ success: false, msg: SOCKET_ERROR }));
  });
}

module.exports = {
  checkAmbulanceAvailabilty,
  checkSocketID
};
