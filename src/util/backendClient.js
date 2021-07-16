import config from "../config/config";

class Client {
  constructor(basePath) {
    this.basePath = basePath || '';
    this.middlewares = [];
  }

  request(path, method, body) {
    let request = new Request(path, method, body)
    this.middlewares.forEach(middleware => {
      if (!middleware.method || middleware.method === method) {
        request = middleware.handler(request) || request
      }
    })
    return request
  }
}

class BackendClient extends Client {

  constructor() {
    super(config.backend_url);
  }


  /**
   * Method to obtain the Document Types configured in the backend
   */
  async getDocumentTypes() {
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    };

    return fetch(config['backend_url'] + '/registrations/api/documentTypes')
  }

  async getEvents() {
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    };

    return fetch(config['backend_url'] + '/registrations/api/registration/events')
  }

  async getMessage(name) {
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    };

    return fetch(config['backend_url'] + '/registrations/api/text?name=' + name)
  }

  async getQuestions() {
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    };

    return fetch(config['backend_url'] + '/registrations/api/questions')
  }

  async lockTemporalCapacity(event_id, amount) {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        event_id: event_id,
        amount: amount
      })
    };

    return fetch(config['backend_url'] + '/registrations/api/registration/tempRegistration', requestOptions)
  }

  async getPerson(document_type, document_id) {
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    };

    return fetch(config['backend_url'] + '/registrations/api/person?document_type=' + document_type + '&document_id=' + document_id)

  }

  async releaseTemporalCapacity(tempRegistrationId) {
    const requestOptions = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    };

    return fetch(config['backend_url'] + '/registrations/api/registration/tempRegistration?temp_registration_id=' + tempRegistrationId.temp_id, requestOptions)

  }

  async   createPerson(person) {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        document_type: person.documentType.id,
        document_id: person.documentId,
        first_name: person.firstName,
        middle_name: person.middleName,
        first_surname: person.firstSurname,
        second_surname: person.secondSurname,
        birthday: person.birthday,
        city: person.city,
        address: person.address,
        phone: person.phone
      })
    };
    debugger;
    return fetch(config['backend_url'] + '/registrations/api/person', requestOptions)
  }

  async register(event, people, tempRegistration) {

    let documents = [];
    people.map(person => {
      documents.push({document_type: person.documentType.id, document_id: person.documentId})
    });
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        event: event.id,
        people: documents,
        temp_registration: tempRegistration.temp_id
      })
    };
    return fetch(config['backend_url'] + '/registrations/api/registration/registration', requestOptions)
  }
}

export const backendClient = new BackendClient(config.lti_backend);