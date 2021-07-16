import {Button, ButtonGroup, Card, Dropdown, Form, FormControl, InputGroup, Modal, ToggleButton} from "react-bootstrap";
import {useEffect, useState} from "react";
import {backendClient} from "../../util/backendClient";
import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import {personStyles} from "./registrationStyles";
import {cancel, TextMessage} from "./registration";
import {Link} from "react-router-dom";

export function PeopleForm({amount, event, tempRegistration}) {
  const [people, setPeople] = useState([]);
  const [finished, setFinished] = useState(false);
  const [registrations, setRegistrations] = useState();
  const [endRegistration, setEndRegistration] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  function getFullName(person) {
    let name = person.firstName + " ";
    name += (person.firstName !== undefined) ? person.firstName + " " : " ";
    name += person.firstSurname + " ";
    name += (person.secondSurname !== undefined) ? person.secondSurname + " " : " ";
    return name;
  }

  function createRegistration() {
    const fetchData = async () => {
      const response = await backendClient.register(event, people, tempRegistration);
      if (response.status === 201) {
        const json = await response.json();
        if (json.registrations.length > 0) {
          debugger;
          setEndRegistration(true);
          setError(false);
          setRegistrations(json.registrations);
          debugger;
        }
      } else if (response.status === 400) {
        debugger;
        const json = await response.json();
        setEndRegistration(true);
        setError(true);
        setErrorMessage(json.message);
        debugger;

      }
    }
    fetchData();
  }

  return (
    <>
      {(!finished) &&
      <PersonForm people={{value: people, setter: setPeople}} amount={amount} setFinished={setFinished}
                  tempRegId={tempRegistration}/>
      }
      {(finished) &&
      <Card>
        {(endRegistration && !error) &&
        <EndMessage registrations={registrations}/>
        }
        {(endRegistration && error) &&
        <ErrorMessage errorMessage={errorMessage}/>
        }
        {(!endRegistration) &&
        <>
          {tempRegistration.temp_id}
          {event.label}
          {people.map(person => (
            <Card>
              <div>
                <div>
                  {person.documentType.name + " " + person.documentId}
                </div>
                <div>
                  {getFullName(person)}
                </div>
              </div>
            </Card>))
          }
          <Button onClick={() => {
            createRegistration();
          }
          }>Confirmar</Button>
        </>
        }
      </Card>
      }
    </>
  );
}

export function PersonForm({people, amount, setFinished, tempRegId}) {
  const [index, setIndex] = useState(1);
  const [person, setPerson] = useState({});
  const [documentType, setDocumentType] = useState({});
  const [documentId, setDocumentId] = useState();
  const [firstname, setFirstname] = useState();
  const [middlename, setMiddlename] = useState();
  const [firstSurname, setFirstSurname] = useState();
  const [secondSurname, setSecondSurname] = useState();
  const [birthday, setBirthday] = useState();
  const [city, setCity] = useState();
  const [address, setAddress] = useState();
  const [phone, setPhone] = useState();
  const [isNew, setIsNew] = useState(true);
  const [showFields, setShowFields] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [termsAndConditions, setTermsAndConditions] = useState(false);
  const [disableNext, setDisableNext] = useState(true);
  const [errorMessage, setErrorMessage] = useState();
  const [dataError, setDataErrors] = useState(false);
  // const [finished, setFinished] = useState(false);
  const [deny, setDeny] = useState(false);

  const styles = personStyles();


  function lookUpPerson() {
    const fetchData = async () => {
      const response = await backendClient.getPerson(person.documentType.id, documentId);
      const personResponse = await response.json();

      if (personResponse.length > 0) {
        person.firstName = personResponse[0].first_name;
        setFirstname(personResponse[0].first_name);
        person.middleName = personResponse[0].middle_name;
        setMiddlename(personResponse[0].middle_name);
        person.firstSurname = personResponse[0].first_surname;
        setFirstSurname(personResponse[0].first_surname);
        person.secondSurname = personResponse[0].second_surname;
        setSecondSurname(personResponse[0].second_surname);
        person.birthday = personResponse[0].birthday;
        setBirthday(personResponse[0].birthday);
        person.city = personResponse[0].city;
        setCity(personResponse[0].city);
        person.address = personResponse[0].address;
        setAddress(personResponse[0].address);
        person.phone = personResponse[0].phone;
        setPhone(personResponse[0].phone);
        setPerson(person);
        setIsNew(false);
        setDisableNext(false);
      } else if (personResponse.length === 0) {
        cleanForm();
      }
      setShowFields(true);
    }
    fetchData();
  }

  function createPerson() {
    const fetchData = async () => {
      const response = await backendClient.createPerson(person);
      debugger;
      if (response.status === 400) {
        const json = response.json();
        debugger;
        setDataErrors(true);

        setErrorMessage("Favor llenar bien el formulario")
      }
      if (response.status === 201) {
        setIsNew(false);
        setDataErrors(false);
        setShowQuestions(true);
      }
    }

    person.documentId = documentId;
    person.firstName = firstname;
    person.middleName = middlename;
    person.firstSurname = firstSurname;
    person.secondSurname = secondSurname;
    person.birthday = birthday;
    person.city = city;
    person.address = address;
    person.phone = parseInt(phone);
    setPerson(person);
    debugger;
    fetchData();
  }


  function cleanForm() {
    person.firstName = "";
    setFirstname("");
    person.middleName = "";
    setMiddlename("");
    person.firstSurname = "";
    setFirstSurname("");
    person.secondSurname = "";
    setSecondSurname("");
    person.birthday = "";
    setBirthday("");
    person.city = "";
    setCity("");
    person.address = "";
    setAddress("");
    person.phone = "";
    setPhone("");
    setPerson(person);
    setIsNew(true);
    setDisableNext(true);
  }

  function reset() {
    debugger;
    setPerson({});
    setDocumentId("");
    setIsNew(true);
    setShowQuestions(false);
    setTermsAndConditions(false);
    setDisableNext(true);
    setDisableNext(true);
    cleanForm();
  }

  return (
    <Card className={styles.person}>
      <Card.Title>
        Persona {index}
      </Card.Title>
      <Card.Body className={styles.personBody}>
        <QuestionsChecker show={showQuestions} setShow={setShowQuestions}
                          confirm={() => {
                            people.value.push(person);
                            people.setter(people.value)
                            if (people.value.lenght === amount) {
                              setFinished(true);
                            } else {
                              if (index === amount)
                                setFinished(true);
                              else {
                                setIndex(index + 1);
                                setShowFields(false);
                                reset();
                              }
                            }
                          }} deny={() => {
          reset();
        }}/>
        <DocumentTypePicker person={{value: person, setter: setPerson}}/>
        <InputGroup className={styles.personInputGroup}>
          <InputGroup.Prepend className={styles.personInputLabel}>
            <InputGroup.Text>Número de Documento</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl type="text" value={documentId} onChange={e => {
            // person.documentId = e.target.value;
            if (e.target.value.length > 0)
              if (!showFields)
                setDisableNext(false);
              else
                setDisableNext(true);
            setDocumentId(e.target.value)
            // setPerson(person);
          }}/>
          {(showFields) &&
          <Button variant="outline-secondary" onClick={() => {
            lookUpPerson();
          }}> Buscar </Button>}
        </InputGroup>

        {(!showFields) &&
        <>
          <ButtonsSet
            next={() => {
              person.documentId = documentId;
              lookUpPerson();
              setPerson(person);
            }}
            cancel={() => {
              cancel(tempRegId)
            }} disabled={disableNext}/>

        </>
        }
        {(showFields) &&
        <>
          <div className={styles.personDataHeader}>
            Datos Personales
          </div>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <InputGroup className={styles.personInputGroup}>
                <InputGroup.Prepend className={styles.personInputLabel}>
                  <InputGroup.Text>Primer Nombre</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={firstname} onChange={e => {
                  setFirstname(e.target.value);
                }}/>
              </InputGroup>
              <InputGroup className={styles.personInputGroup}>
                <InputGroup.Prepend className={styles.personInputLabel}>
                  <InputGroup.Text>Segundo Nombre</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={middlename} onChange={e => {
                  setMiddlename(e.target.value);
                }}/>
              </InputGroup>
              <InputGroup className={styles.personInputGroup}>
                <InputGroup.Prepend className={styles.personInputLabel}>
                  <InputGroup.Text>Primer Apellido</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={firstSurname} onChange={e => {
                  setFirstSurname(e.target.value);
                }}/>
              </InputGroup>
              <InputGroup className={styles.personInputGroup}>
                <InputGroup.Prepend className={styles.personInputLabel}>
                  <InputGroup.Text>Segundo Apellido</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={secondSurname} onChange={e => {
                  setSecondSurname(e.target.value);
                }}/>
              </InputGroup>
              <InputGroup className={styles.personInputGroup}>
                <InputGroup.Prepend className={styles.personInputLabel}>
                  <InputGroup.Text>Fecha de Nacimiento:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl type={"date"} value={birthday} onChange={e => {
                  setBirthday(e.target.value);
                }}/>
              </InputGroup>
              <InputGroup className={styles.personInputGroup}>
                <InputGroup.Prepend className={styles.personInputLabel}>
                  <InputGroup.Text>Ciudad:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={city} onChange={e => {
                  setCity(e.target.value);
                }}/>
              </InputGroup>
              <InputGroup className={styles.personInputGroup}>
                <InputGroup.Prepend className={styles.personInputLabel}>
                  <InputGroup.Text>Dirección:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={address} as="textarea" onChange={e => {
                  setAddress(e.target.value);
                }}/>
              </InputGroup>
              <InputGroup className={styles.personInputGroup}>
                <InputGroup.Prepend className={styles.personInputLabel}>
                  <InputGroup.Text>Teléfono:</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={phone} onChange={e => {
                  setPhone(e.target.value);
                }}/>
              </InputGroup>

              {(isNew) &&
              <InputGroup>
                <TextMessage name={"data-policies"}/>
                <ToggleButton size="xs" variant="outline-secondary" checked={termsAndConditions} type="checkbox"
                              onChange={e => {
                                setTermsAndConditions(e.target.checked);
                                setDisableNext(!e.target.checked);
                              }}/>
              </InputGroup>
              }
              <ButtonsSet next={() => {
                if (isNew) {
                  createPerson();
                }
                if (!isNew && !dataError)
                  setShowQuestions(true);
                else {

                }
              }} cancel={() => {
                cancel(tempRegId)
              }} disabled={disableNext}
              />
            </Form.Group>
          </Form>
        </>
        }
      </Card.Body>
    </Card>
  )
}

function DocumentTypePicker(
  {
    person
  }
) {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [changed, setChanged] = useState(false);
  const styles = personStyles();

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
    <>
      <InputGroup className={styles.personInputGroup}>
        <InputGroup.Prepend className={styles.personInputLabel}>
          <InputGroup.Text>Tipo de documento:</InputGroup.Text>
        </InputGroup.Prepend>
        <Dropdown className={styles.documentTypeDropdown}>
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic"
                           className={styles.documentTypeDropdownLabel}>
            {(person.value.documentType !== undefined) && person.value.documentType.name}
          </Dropdown.Toggle>
          <Dropdown.Menu className={styles.documentTypeDropdownLabel}>
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
    </>
  )
}

function QuestionsChecker({show, setShow, confirm, deny}) {
  const [questions, setQuestions] = useState([]);
  let [confirmed, setConfirmed] = useState(true);

  const styles = personStyles();

  useEffect(() => {
    const fetchData = async () => {
      const response = await backendClient.getQuestions();
      const questionsResponse = await response.json();

      questionsResponse.map((question) => {
        question.answer = true
      });
      setQuestions(questionsResponse);
    }
    fetchData();
  }, []);

  return (
    <Modal size="lg" show={show} onHide={() => {
      setShow(false)
    }}>
      {(confirmed) &&
      <>
        <Modal.Header>
          Preguntas de seguridad
        </Modal.Header>
        <Modal.Body>
          {questions.map((question, index) => (
            <Question index={index} question={question} setQuestionAnswer={(a) => {
              question.answer = a;
              questions[index] = question;
              setQuestions(questions);
            }}/>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            questions.map(question => {
              confirmed = question.answer && confirmed;
              setConfirmed(confirmed)
            })
            if (confirmed) {
              confirm();
            } else {
              setConfirmed(true);
              deny();
            }

          }}>Confirmar</Button>
        </Modal.Footer>
      </>
      }
      {(!confirmed) && <Card>
        <TextMessage name={'deny'}/>
      </Card>
      }
    </Modal>
  );
}

function Question(
  {
    index, question, setQuestionAnswer
  }
) {
  const [answer, setAnswer] = useState(true);
  const styles = personStyles();

  return (
    <InputGroup className={styles.question}>
      <InputGroup.Text className={styles.questionLabel}>
        {index + 1}
      </InputGroup.Text>
      <InputGroup.Text className={styles.questionText}>
        {question.value}
      </InputGroup.Text>
      <ToggleButton
        checked={answer}
        variant={(answer) ? "success" : "outline-danger"}
        type="checkbox"
        onChange={e => {
          setAnswer(e.target.checked);
          setQuestionAnswer(e.target.checked);
        }}>
        {(answer) ? "Si" : "No"}
      </ToggleButton>
    </InputGroup>
  )
}


function ButtonsSet({cancel, next, disabled}){
  const styles = personStyles();

  return (
    <div className={styles.documentTypeButtons}>
      <ButtonGroup>
        <Button size="lg" variant="danger" onClick={() => {
          cancel();
        }}> Cancelar </Button>
        <Button size="lg" variant="primary" disabled={disabled} onClick={() => {
          next();
        }}> Siguiente </Button>
      </ButtonGroup>
    </div>
  )
}

function EndMessage({registrations}) {
  function refreshPage() {
    window.location.reload();
  }

  return (
    <>
      <TextMessage name={'registration-complete'}/>
      {(registrations !== undefined) &&
      <>
        {registrations.map(reg => (reg))}
      </>
      }
      <Button onClick={() => {
        refreshPage();
      }}>Aceptar</Button>
    </>
  );
}

function ErrorMessage({errorMessage}) {

  function refreshPage() {
    window.location.reload();
  }

  return (
    <>
      {errorMessage}
      <Button onClick={() => {
        refreshPage()
      }}>Aceptar</Button>
    </>
  )
}