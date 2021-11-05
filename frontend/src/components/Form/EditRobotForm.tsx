import React, { useState, useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useInput } from '../../customHooks/useInput';
import { RobotType } from '../../Pages/Robots';
import { NickNameType } from '../RobotDetails/RobotDetails';
import { capitalizedFirstLetterOfEveryWord } from '../Utils/Utils';
import { FormStyled } from './CreateRobotForm.styles';
import { RadioInput } from './RadioInput';
import { TVSERIES } from './TvSeries.data';

// stackoverflow.com/questions/57667198/typescript-error-type-string-cant-be-used-to-index-type-x/57667278#57667278
// !Typescript Indexable Type
const tvSeriesState: { [key: string]: boolean } = {
  // !Typescript Utility Type
  // const tvSeriesIsChecked: Record<string, boolean> = {
  FullHouse: false,
  Moana: false,
  Superman: false,
  Wolfgang: false,
  'Zack & Cody': false,
  'Squid Game': false,
  Scream: false,
  '3rd Rock From the Sun': false,
  Batman: false,
  'Silicon Valley': false,
  Cars: false,
  Lucifer: false,
};

// coke: "8.1"
// countries: "68"
// durians: false
// email: "xman-007@power.com"
// favourite-color: "violet"
// favourite-series: (2) ['Superman', '3rd Rock From the Sun']
// joke: "i am The fuTURe presiDENT."
// likes: 2
// nickname: "x man"
// robotNumber: "729"
// robotUrl: "https://robohash.org/729"
// timestamp: "2021-11-05T13:10:43.379Z"
// _id: "61852d5374fa4f1de7a8e7bf"

const EditRobotForm: React.FC = () => {
  const [mongoDbRobot, setMongoDbRobot] = useState<RobotType>();

  const [durians, setDurians] = useState(true);
  const [color, setColor] = useState('');
  const [tvSeries, setTvSeries] = useState(tvSeriesState);
  const [tvSeriesError, setTvSeriesError] = useState(false);

  // const duriansAreValid = durians === 'yes' || durians === 'no';
  const colorIsValid = color !== 'Colors of the Rainbow';
  const colorHasError = !colorIsValid;

  const getSpecificRobot = useParams<NickNameType>();
  const robotNickname = getSpecificRobot['nickname'];

  useEffect(() => {
    const getRobot = async () => {
      const result = await fetch(`/robots/${robotNickname}`);
      const robot = await result.json();
      setMongoDbRobot(robot);
    };
    getRobot();
  }, []);

  // select color
  const onColorChangeHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setColor(event.target.value);
  };

  // select tv series
  const onCheckBoxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const series = event.target.name;
    setTvSeries((prevState) => ({
      ...prevState,
      [series]: !prevState[series],
    }));
    setTvSeriesError(false);
  };

  const selectAllCheckBoxes = (checked: boolean): void => {
    Object.keys(tvSeriesState).forEach((series) => {
      setTvSeries((prevState) => ({
        ...prevState,
        [series]: checked,
      }));
    });
  };
  const onCheckAllCheckBoxes = () => {
    selectAllCheckBoxes(true);
    setTvSeriesError(false);
  };

  const onUncheckAllCheckBoxes = () => selectAllCheckBoxes(false);
  const checkedTvSeries = Object.fromEntries(
    Object.entries(tvSeries).filter(([series, checked]) => checked === true)
  );
  const tvSeriesMinimumOneChecked = Object.keys(checkedTvSeries).length > 0;

  // hasError: nicknameInputHasError <-- this is giving an alias; renaming hasError
  const {
    value: enteredNickname,
    isValid: enteredNicknameIsValid,
    hasError: nicknameInputHasError,
    onValueChangeHandler: nicknameChangeHandler,
    onValueBlurHandler: nicknameBlurHandler,
    reset: resetNicknameInput,
  } = useInput((value) => value.trim() !== '');
  const nicknameLengthBelow10 = enteredNickname.length <= 10;

  const {
    value: enteredRobotNumber,
    isValid: enteredRobotNumberIsValid,
    hasError: robotNumberInputHasError,
    onValueChangeHandler: robotNumberChangeHandler,
    onValueBlurHandler: robotNumberBlurHandler,
    reset: resetRobotNumberInput,
  } = useInput(
    (value) => +value >= 1 && +value <= 1000 && !value.includes('.')
  );

  const {
    value: enteredEmail,
    isValid: enteredEmailIsValid,
    hasError: emailInputHasError,
    onValueChangeHandler: emailChangeHandler,
    onValueBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput((value) => value.includes('@'));

  const {
    value: enteredCoke,
    isValid: enteredCokeIsValid,
    hasError: cokeInputHasError,
    onValueChangeHandler: cokeChangeHandler,
    onValueBlurHandler: cokeBlurHandler,
    reset: resetCokeInput,
  } = useInput((value) => +value >= 0.1 && +value <= 30);
  const cokeIsOverPriced = +enteredCoke > 30;

  const {
    value: enteredJoke,
    isValid: enteredJokeIsValid,
    hasError: jokeInputHasError,
    onValueChangeHandler: jokeChangeHandler,
    onValueBlurHandler: jokeBlurHandler,
    reset: resetJokeInput,
  } = useInput((value) => value.trim() !== '');
  const jokeNotTooLong = enteredJoke.length <= 200;

  const {
    value: enteredCountries,
    isValid: enteredCountriesIsValid,
    hasError: countriesInputHasError,
    onValueChangeHandler: countriesChangeHandler,
    onValueBlurHandler: countriesBlurHandler,
    reset: resetCountriesInput,
  } = useInput((value) => +value >= 1 && +value <= 195 && !value.includes('.'));

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    let tvSeriesHasError = false;
    // IIFE - immediately invoked function expression
    (function () {
      if (!tvSeriesMinimumOneChecked) {
        setTvSeriesError(true);
        tvSeriesHasError = true;
      }
    })();

    if (
      !enteredNicknameIsValid ||
      !nicknameLengthBelow10 ||
      !enteredEmailIsValid ||
      !enteredRobotNumberIsValid ||
      !enteredCokeIsValid ||
      !enteredJokeIsValid ||
      colorHasError ||
      tvSeriesHasError ||
      !enteredCountriesIsValid
    ) {
      return;
    }

    let tvSeriesArray = [];
    for (let key in mongoDbRobot) {
      if (tvSeries[key] === true) {
        tvSeriesArray.push(key);
      }
    }
    // // https://stackoverflow.com/questions/57667198/typescript-error-type-string-cant-be-used-to-index-type-x/57667278#57667278
    // // !using Typescript Indexable types
    // for (let key in tvSeries) {
    //   // !using Typescript Utility type
    //   //   // console.log(`${key}: ${tvSeriesIsChecked[key]}`);
    //   // for (const key of Object.keys(tvSeries)) {
    //   if (tvSeries[key] === true) {
    //     tvSeriesArray.push(key);
    //   }
    // }

    // const duriansBoolean = durians === 'yes' ? true : false;
    // send to browser
    const editedRobot = {
      nickname: enteredNickname,
      robotNumber: enteredRobotNumber,
      email: enteredEmail,
      coke: enteredCoke,
      joke: enteredJoke,
      'favourite-color': color,
      'favourite-series': tvSeriesArray,
      countries: enteredCountries,
      durians,
    };
    // console.clear();
    console.log(editedRobot);

    // fetch('/robots/newrobot', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     nickname: enteredNickname,
    //     robotNumber: enteredRobotNumber,
    //     email: enteredEmail,
    //     coke: enteredCoke,
    //     joke: enteredJoke,
    //     'favourite-color': color,
    //     'favourite-series': tvSeriesArray,
    //     countries: enteredCountries,
    //     durians,
    //   }),
    // });

    resetNicknameInput();
    resetEmailInput();
    resetRobotNumberInput();
    resetCokeInput();
    resetJokeInput();
    setColor(''); // how to reset to original?
    // selectColorInputRef.current.select.clearValue();
    onUncheckAllCheckBoxes();
    resetCountriesInput();
    setDurians(true);
  };

  return (
    <Container>
      {mongoDbRobot && (
        <FormStyled>
          <Form onSubmit={onSubmitHandler}>
            <h3>Create A Robot</h3>
            <Form.Group className='mb-4'>
              <Form.Label>Give a robot nickname 🤖</Form.Label>
              <Form.Control
                type='text'
                onChange={nicknameChangeHandler}
                value={capitalizedFirstLetterOfEveryWord(mongoDbRobot.nickname)}
              />
              {nicknameInputHasError && (
                <Form.Text className='text-danger'>
                  Please enter a nickname
                </Form.Text>
              )}
              {!nicknameLengthBelow10 && (
                <Form.Text className='text-danger'>
                  Nickname should be maximum 10 characters
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>Choose a number between 1 and 1000 💯</Form.Label>
              <Form.Control
                type='number'
                onChange={robotNumberChangeHandler}
                value={mongoDbRobot.robotNumber}
                min='1'
                max='1000'
                step='1'
              />
              {robotNumberInputHasError && (
                <Form.Text className='text-danger'>
                  Please enter a valid whole number below 1001
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>Your email 💌</Form.Label>
              <Form.Control
                type='email'
                onChange={emailChangeHandler}
                value={mongoDbRobot.email}
              />
              {emailInputHasError && (
                <Form.Text className='text-danger'>
                  Please enter a valid email
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>
                How much is a can of Coke 🥫 in your country?
              </Form.Label>
              <Form.Control
                type='number'
                onChange={cokeChangeHandler}
                value={mongoDbRobot.coke}
                min='0.1'
                max='30'
                step='0.1'
              />
              {/* <Form.Range min='0.1' max='10' step='0.1' /> */}
              {/* <p>SGD$ value</p> */}
              {cokeInputHasError && (
                <Form.Text className='text-danger'>
                  Please enter a valid number
                </Form.Text>
              )}
              {cokeIsOverPriced && (
                <Form.Text className='text-danger'>
                  <br />
                  🥴 Does it cost THAT much?
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>Tell me a joke! 🤣</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                type='text'
                onChange={jokeChangeHandler}
                value={mongoDbRobot.joke}
              />
              {jokeInputHasError && (
                <Form.Text className='text-danger'>Make me laugh</Form.Text>
              )}
              {!jokeNotTooLong && (
                <Form.Text className='text-danger'>
                  Shorter joke below 200 characters please
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>Pick your favourite color 🌈</Form.Label>
              <Form.Select
                onChange={onColorChangeHandler}
                value={mongoDbRobot['favourite-color']}
              >
                <option>Colors of the Rainbow</option>
                <option value='red'>Red</option>
                <option value='orange'>Orange</option>
                <option value='yellow'>Yellow</option>
                <option value='green'>Green</option>
                <option value='blue'>Blue</option>
                <option value='indigo'>Indigo</option>
                <option value='violet'>Violet</option>
              </Form.Select>
              {colorHasError && (
                <Form.Text className='text-danger'>Choose a color</Form.Text>
              )}
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>Pick some favourite TV series 📺</Form.Label>
              {TVSERIES.map((series, index) => {
                return (
                  <div key={index}>
                    <Form.Check.Label>
                      <Form.Check
                        inline
                        type='checkbox'
                        name={series}
                        checked={tvSeries[series]}
                        onChange={onCheckBoxChange}
                      />
                      {series}
                    </Form.Check.Label>
                  </div>
                );
              })}
              <Button
                variant='info'
                type='button'
                size='sm'
                className='mt-2'
                onClick={onCheckAllCheckBoxes}
              >
                Select All
              </Button>
              <Button
                variant='primary'
                type='button'
                size='sm'
                className='mt-2 mx-2'
                onClick={onUncheckAllCheckBoxes}
              >
                Deselect All
              </Button>
              <br />
              {tvSeriesError && (
                <Form.Text className='text-danger'>
                  C'mon, choose at least 1 Tv Programme
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>How many countries have you visited?</Form.Label>
              <Form.Control
                type='number'
                onChange={countriesChangeHandler}
                value={mongoDbRobot.countries}
                min='1'
                max='195'
                step='1'
              />
              {countriesInputHasError && (
                <Form.Text className='text-danger'>
                  There are 195 countries in the world
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className='mb-4'>
              <Form.Label>Do you agree durians smell good? 💚</Form.Label>
              <br />
              <Form.Check.Label>
                <RadioInput
                  inline
                  label='Yes!'
                  value={true}
                  checked={mongoDbRobot.durians}
                  setter={setDurians}
                />
              </Form.Check.Label>
              <Form.Check.Label>
                <RadioInput
                  inline
                  label='Eww...'
                  value={false}
                  checked={mongoDbRobot.durians}
                  setter={setDurians}
                />
              </Form.Check.Label>
            </Form.Group>
            <Button variant='warning' type='submit' className='mb-2'>
              Save Robot 🤖
            </Button>
          </Form>
        </FormStyled>
      )}
    </Container>
  );
};

export default EditRobotForm;