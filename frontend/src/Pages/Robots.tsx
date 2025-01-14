import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RobotsStyled, SpinnerStyled, LikesStyled } from './Robots.styles';

export interface RobotType {
  _id: string;
  timestamp: string;
  nickname: string;
  email: string;
  robotNumber: number;
  robotUrl: string;
  'favourite-color': string;
  'favourite-series': string[];
  coke: number;
  joke: string;
  countries: number;
  durians: boolean;
  likes: number;
}

const Robots: React.FC = (): React.ReactElement => {
  const [robots, setRobots] = useState<RobotType[]>([]);
  const [individualRobot, setIndividualRobot] = useState('');
  const [statusCode200, setStatusCode200] = useState(false);
  const [showLikeSpinner, setShowLikeSpinner] = useState(false);

  useEffect(() => {
    let mounted = true;
    const getRobots = async () => {
      const results = await fetch('/robots');
      const response = await results.json();
      if (mounted) {
        setRobots(response);
        setStatusCode200(true);
      }
    };
    getRobots();
    return () => {
      mounted = false;
    };
  }, []);

  const upVoteHandler = async (nickname: string) => {
    setIndividualRobot(nickname);
    setShowLikeSpinner(true);
    const result = await fetch(`/robots/${nickname}/likes`, {
      method: 'POST',
    });
    const body = await result.json();
    setRobots(body);
    setShowLikeSpinner(false);
  };

  return (
    <RobotsStyled>
      <Container>
        {!statusCode200 && (
          <SpinnerStyled>
            <Spinner animation='border' variant='danger' />
          </SpinnerStyled>
        )}
        <Row>
          {robots &&
            robots.map((robot) => (
              <Col xs={12} md={6} lg={3} key={robot._id}>
                <Card>
                  <Card.Img variant='top' src={robot.robotUrl} />
                  <Card.Body>
                    <Link to={`/robots/${robot.nickname}`}>
                      <Button variant='info' className='capitalize mx-1 mb-2'>
                        {robot.nickname}
                      </Button>
                    </Link>
                    <Button
                      variant='primary'
                      className='mx-1 mb-2'
                      onClick={() => upVoteHandler(robot.nickname)}
                    >
                      {individualRobot === robot.nickname && showLikeSpinner ? (
                        <Spinner
                          animation='border'
                          variant='light'
                          size='sm'
                          className='mx-4'
                        />
                      ) : (
                        'Like 👍'
                      )}
                    </Button>
                    <br />
                    <span>
                      Likes : <LikesStyled>{robot.likes}</LikesStyled>
                    </span>
                  </Card.Body>
                </Card>
                <br />
              </Col>
            ))}
        </Row>
      </Container>
    </RobotsStyled>
  );
};

export default Robots;
