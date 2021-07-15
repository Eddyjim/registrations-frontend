import {Button, Card, Dropdown, FormControl, InputGroup} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Plus, ShieldMinus} from "react-bootstrap-icons";
import {PeopleForm, PersonForm} from "./person";
import {backendClient} from "../../util/backendClient";
import {registrationStyles} from "./registrationStyles";
import 'bootstrap/dist/css/bootstrap.min.css';


export function Registration() {
  const styles = registrationStyles();
  const [count, setCount] = useState(1);
  const [onInscription, setOnInscription] = useState(false)
  const [tempRegistration, setTempRegistration] = useState()
  return (
    <Card>
      <Card.Body className={styles.registration}>
        <EventSelection count={{
          value: count, setter: (i) => {
            setCount(i)
          }
        }} tempRegistration={{value: tempRegistration, setter: setTempRegistration}}
                        onInscription={{value: onInscription, setter: setOnInscription}}/>
        {(tempRegistration !== undefined) && tempRegistration.message}
        {(onInscription === true) &&
        <Card>
          <Card.Body>

            {/*<TextMessage name={'timelimit'} />*/}
            <PeopleForm amount={count}/>
          </Card.Body>
        </Card>
        }


      </Card.Body>

    </Card>

  );
}

function EventSelection({count, tempRegistration, onInscription}) {
  // const [onInscription, setOnInscription] = useState(false)
  const [event, setEvent] = useState();
  const styles = registrationStyles();


  function getLockTemporalCapacity(event, count) {
    const fetchData = async () => {
      const response = await backendClient.lockTemporalCapacity(event.id, count);
      const tempRegistrationResponse = await response.json();
      tempRegistration.setter(tempRegistrationResponse)
    }

    fetchData()
    // tempRegistrationCallback(tempRegistration);
  }

  return (
    <Card className={styles.eventPicker}>
      <Card.Body>
        {(onInscription.value === false) &&
        <Card>
          <Card.Body>
            <EventPicker event={{value: event, setter: setEvent}}/>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Número de personas a registrar:</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl value={count.value}/>
            </InputGroup>
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
          </Card.Body>

          <Button onClick={() => {
            getLockTemporalCapacity(event, count.value);
            onInscription.setter(true);
          }} disabled={(count.value <= 0)}>
            Registrar
          </Button>
        </Card>
        }

      </Card.Body>
    </Card>
  )
}

function EventPicker({event}) {
  const [events, setEvents] = useState([]);

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
    <Card>
      <InputGroup>
        <InputGroup.Prepend>
          Sesión
        </InputGroup.Prepend>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {(event.value !== undefined) && event.value.label}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {events.map(e => (
              <Dropdown.Item onClick={() => {
                event.setter(e)
              }}>{e.label}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </InputGroup>
      {(event.value !== undefined) &&
      <EventDescriptor event={event.value}/>
      }
    </Card>
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

function TextMessage({name}) {
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
    <Card>
      <Card.Body>
        {(message !== undefined) && message.value}
      </Card.Body>
    </Card>
  )
}