import {Button, ButtonGroup, Card, Dropdown, FormControl, InputGroup, Modal, ToggleButton} from "react-bootstrap";
import {useEffect, useState} from "react";
import {backendClient} from "../../util/backendClient";
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

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
  const [isNew, setIsNew] = useState(true);
  const [showFields, setShowFields] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

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

      const response = await backendClient.createPerson(person);
      // debugger;
    }
    fetchData();
  }

  return (
    <Card>
      <Card.Title>
        Persona {index}
      </Card.Title>
      <Card.Body>
        <QuestionsChecker show={showQuestions} setShow={setShowQuestions}/>
        <Card>
          <Card.Title>
            Identificación
          </Card.Title>
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
          Datos
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
            // people.value.push(person)
            // people.setter(people.value)
            setShowQuestions(true);
          }}>
          </Button>
        </Card>
        }
      </Card.Body>
    </Card>
  )
}

function QuestionsChecker({show, setShow}) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await backendClient.getQuestions();
      const questionsResponse = await response.json();
      questionsResponse.map((question) => {
        question.answer = true
      });
      setQuestions(questionsResponse);

      // if (answers.length < questionsResponse.length) {
      //   [...Array(questionsResponse.length)].map(() => {
      //     answers.push(true)
      //   });
      //   setAnswers(answers);
      //   debugger;
      // }
    }
    fetchData();
  }, []);

  return (
    <Modal show={show} onHide={() => {setShow(false)}}>
      <Modal.Header>
        Preguntas de seguridad
      </Modal.Header>
      <Modal.Body>
        {questions.map((question, index) => (
          <Question index={index} question={question} setAnswer={(a) => {
            question.answer = a;
            questions[index] = question;
            setQuestions(questions);
          }}/>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary">Confirmar</Button>
      </Modal.Footer>
    </Modal>
  );
}

function Question({index, question, setAnswer}) {
  return (
    <InputGroup>
      <InputGroup.Prepend>
        {index}
      </InputGroup.Prepend>
      <InputGroup.Text>
        {question.value}
      </InputGroup.Text>
      <BootstrapSwitchButton
        checked={question.answer}
        onlabel='Si'
        offlabel='No'
        onstyle="success"
        offstyle="danger"
        size="xm"
        width={100}
        style="border"
        onChange={(checked) => {
          setAnswer(checked)
        }}
      />


      {/*<ButtonGroup className="mb-2">*/}
      {/*<ToggleButton*/}
      {/*  variant={answer ? "success" : "outline-success"}*/}
      {/*  type="radio"*/}
      {/*  checked={answer}*/}
      {/*  // onClick={}*/}
      {/*  onChange={(e) => {*/}
      {/*    setAnswer(e.currentTarget.checked);*/}
      {/*    debugger;*/}
      {/*  }}> Si </ToggleButton>*/}
      {/*<ToggleButton*/}
      {/*  variant={answer ? "outline-danger" : "danger"}*/}
      {/*  type="radio"*/}
      {/*  checked={!answer}*/}
      {/*  onChange={(e) => {*/}
      {/*    setAnswer(!e.currentTarget.checked);*/}
      {/*    debugger;*/}
      {/*  }}> No </ToggleButton>*/}
      {/*</ButtonGroup>*/}
    </InputGroup>
  )
}

function DocumentTypePicker({person}) {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await backendClient.getDocumentTypes();
      const documentTypesResponse = await response.json();
      if (!changed) {
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