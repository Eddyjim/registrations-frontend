import {Button, Card, Dropdown, FormControl, InputGroup} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Plus, ShieldMinus} from "react-bootstrap-icons";
import {PeopleForm} from "./person";
import {backendClient} from "../../util/backendClient";
import {registrationStyles} from "./registrationStyles";
import 'bootstrap/dist/css/bootstrap.min.css';


export function Registration() {
  const [count, setCount] = useState(1);
  const [onInscription, setOnInscription] = useState(false);
  const [tempRegistration, setTempRegistration] = useState();
  const [event, setEvent] = useState({});
  const styles = registrationStyles();

  useEffect(() => {
    document.title = "Registro";   }, []);

  return (
    <Card className={styles.registration}>
      <Card.Title>Incripciones</Card.Title>
      <Card.Body className={styles.registrationBody}>
        <EventSelection count={{
          value: count, setter: (i) => {
            setCount(i)
          }
        }} tempRegistration={{value: tempRegistration, setter: setTempRegistration}}
                        onInscription={{value: onInscription, setter: setOnInscription}} event={{value:event, setter:setEvent}}/>
        {(tempRegistration !== undefined) && tempRegistration.message}
        {(onInscription === true) &&
        <PeopleForm amount={count} event={event} tempRegistration={tempRegistration}/>
        }
      </Card.Body>

    </Card>

  );
}

function EventSelection({count, tempRegistration, onInscription, event}) {
  // const [onInscription, setOnInscription] = useState(false)
  // const [event, setEvent] = useState();
  const [registration, setRegistration] = useState();
  const styles = registrationStyles();

  function getLockTemporalCapacity(event, count) {
    const fetchData = async () => {
      const response = await backendClient.lockTemporalCapacity(event.value.id, count);
      const tempRegistrationResponse = await response.json();
      setRegistration(registration);
      tempRegistration.setter(tempRegistrationResponse)
    }
    fetchData();
    // tempRegistrationCallback(tempRegistration);
  }

  return (
    <>
      {(onInscription.value === false) &&
      <Card className={styles.eventPicker}>
        <Card.Body className={styles.eventPickerBody}>
          <EventPicker event={event}/>
          <InputGroup>
              <InputGroup.Text className={styles.eventPickerLabel}>Número de personas a registrar:</InputGroup.Text>
            <FormControl value={count.value}/>
            <Button variant="danger" onClick={() => {
              if (count.value > 0) {
                count.setter(count.value - 1)
              }
            }}>
              <ShieldMinus/>
            </Button>

            <Button variant="success" onClick={() => {
              count.setter(count.value + 1)
            }}>
              <Plus/>
            </Button>
          </InputGroup>

        </Card.Body>

        <Button onClick={() => {
          getLockTemporalCapacity(event, count.value);
          onInscription.setter(true);
        }} disabled={(count.value <= 0)}>
          Registrar
        </Button>
      </Card>
      }
    </>
  )
}

function EventPicker({event}) {
  const [events, setEvents] = useState([]);
  const styles = registrationStyles();

  useEffect(() => {
    const fetchData = async () => {
      const response = await backendClient.getEvents();
      const events = await response.json();
      event.setter(events[0])
      setEvents(events);
    }
    fetchData();
  }, []);

  return (
    <>
      <InputGroup>
        <InputGroup.Prepend className={styles.eventPickerLabel}>
          <InputGroup.Text>Sesión</InputGroup.Text>
        </InputGroup.Prepend>
        <Dropdown variant="outline-secondary" className={styles.sessionPicker}>
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" className={styles.sessionPickerLabel}>
            {(event.value !== undefined) && event.value.label}
          </Dropdown.Toggle>
          <Dropdown.Menu className={styles.sessionPickerLabel}>
            {events.map(e => (
              <Dropdown.Item className={styles.sessionPickerDropdownLabel} onClick={() => {
                event.setter(e)
              }}>{e.label}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </InputGroup>
      {(event.value !== undefined) &&
      <EventDescriptor event={event.value}/>
      }
    </>
  )
}

function EventDescriptor({event}) {
  return (
    <Card>
      <Card.Body>
        Fecha: {event.date}
        <br/>
        Auditorio: {event.location_name}
        <br/>
        Dirección: {event.location_address}
        <br/>
        Cupos Disponibles: {event.capacity - event.current_capacity}
      </Card.Body>
    </Card>
  )
}

export function TextMessage({name}) {
  const [message, setMessage] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const response = await backendClient.getMessage(name);
      const messageResponse = await response.json();
      setMessage(messageResponse);
    }
    fetchData();
  }, []);

  return (
    <>
      {(message !== undefined) && message.value}
    </>
  )
}

export function cancel(tempRegistration){
  const fetchData = async () => {
    const response = await backendClient.releaseTemporalCapacity(tempRegistration);
    window.location.reload();
  }
  fetchData();
}