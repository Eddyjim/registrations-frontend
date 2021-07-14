import {Button, Card, Dropdown, FormControl, InputGroup} from "react-bootstrap";
import {useEffect, useState} from "react";
import {backendClient} from "../../util/backendClient";

export function PeopleForm({amount}) {
  const [people, setPeople] = useState([]);

  return (
    [...Array(amount)].map((e, index) => (
      <PersonForm people={{value: people, setter: setPeople}} index={index}/>
    ))
  );
}

export function PersonForm({people, index}) {
  const [person, setPerson] = useState({});
  const [documentType, setDocumentType] = useState()
  const [documentId, setDocumentId] = useState();
  const [isNew, setIsNew] = useState(true);
  const [showFields, setShowFields] = useState(false);

  function lookUpPerson() {
    const fetchData = async () => {
      const response = await backendClient.getPerson(person.documentType.id, person.documentId);
      const personResponse = await response.json();
      if (personResponse.length > 0) {
        person.firstName = personResponse[0].first_name;
        person.middleName = personResponse[0].middle_name;
        person.firstSurname = personResponse[0].first_surname;
        person.secondSurname = personResponse[0].second_surname;
        person.birthday = personResponse[0].birthday;
        person.city = personResponse[0].city;
        person.address = personResponse[0].address;
        person.phone = personResponse[0].phone;
        setPerson(person);
        setIsNew(false);
      }
      setShowFields(true);
    }
    fetchData();
  }

  function createPerson() {
    const fetchData = async () => {
      debugger;
      const response = await backendClient.createPerson(person);
      // const personResponse = await response.json();
    }
    fetchData();
  }

  return (
    <Card>
      <Card.Title>
        Datos Personales
      </Card.Title>
      <Card.Body>
        <Card>
          <Card.Body>
            <DocumentTypePicker person={{value: person, setter: setPerson}}/>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Número de Documento</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl value={person.documentId} onChange={e => {
                const newValue = e.target.value;
                person.documentId = newValue
                setPerson(person)
              }}/>
            </InputGroup>
            {(!showFields) &&
            <Button variant="success" onClick={() => {
              lookUpPerson()

            }}>

            </Button>
            }
          </Card.Body>
        </Card>

        {(showFields) &&
        <Card>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Primer Nombre</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl value={person.firstName} onChange={e => {
              const newValue = e.target.value;
              person.firstName = newValue
              setPerson(person)
            }}/>
          </InputGroup><InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Segundo Nombre</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl value={person.middleName} onChange={e => {
            const newValue = e.target.value;
            person.middleName = newValue
            setPerson(person)
          }}/>
        </InputGroup>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Primer Apellido</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl value={person.firstSurname} onChange={e => {
              const newValue = e.target.value;
              person.firstSurname = newValue
              setPerson(person)
            }}/>
          </InputGroup>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Segundo Apellido</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl value={person.secondSurname} onChange={e => {
              const newValue = e.target.value;
              person.secondSurname = newValue
              setPerson(person)
            }}/>
          </InputGroup>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Fecha de Nacimiento:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl type={"date"} value={person.birthday} onChange={e => {
              const newValue = e.target.value;
              person.birthday = newValue
              setPerson(person)
            }}/>
          </InputGroup>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Ciudad:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl value={person.city} onChange={e => {
              const newValue = e.target.value;
              person.city = newValue
              setPerson(person)
            }}/>
          </InputGroup>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Dirección:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl value={person.address} onChange={e => {
              const newValue = e.target.value;
              person.address = newValue
              setPerson(person)
            }}/>
          </InputGroup>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Teléfono:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl value={person.phone} onChange={e => {
              const newValue = e.target.value;
              person.phone = newValue
              setPerson(person)
            }}/>
          </InputGroup>
          <Button variant="success" onClick={() => {
            if (isNew) {
              createPerson();
            }
            people.value.push(person)
            people.setter(people.value)
          }}>
          </Button>
        </Card>
        }

      </Card.Body>
    </Card>
  )
}

function DocumentTypePicker({person}) {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await backendClient.getDocumentTypes();
      const documentTypesResponse = await response.json();
      if ( !changed ) {
        person.value.documentType = documentTypesResponse[0];
      }
      setDocumentTypes(documentTypesResponse);
    }
    fetchData();
  }, []);

  return (
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>Tipo de documento:</InputGroup.Text>
      </InputGroup.Prepend>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {(person.value.documentType !== undefined) && person.value.documentType.name}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {documentTypes.map(dt => (
            <Dropdown.Item onClick={() => {
              // let personObject = ;
              person.value.documentType = dt;
              setChanged(true);
              person.setter(person.value);
            }}>{dt.name}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </InputGroup>
  )
}