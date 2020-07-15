import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Card, Grid } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';

import Questions from './questions.json';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '60%',
    margin: '0 auto',
    height: '100vh',
    overflow: 'auto'
  },
  progressBar: {
    backgroundColor: 'rgb(169, 170, 169)',
    height: 20
  },
  formDiv: {
    margin: '5% 10%',
    textAlign: 'left'
  },
  entertainTitle: {
    fontSize: 16,
    fontWeight: 400,
    color: 'rgb(139, 139, 139, 0.7)'
  },
  questionCoutner: {
    fontSize: 26,
    fontWeight: 700
  },
  question: {
    fontSize: 22,
    fontWeight: 500
  },
  button: {
    width: '100%',
    padding: '0 auto',
    height: '100%',
    fontSize: 20,
    fontWeight: 500,
    backgroundColor: '#E5E6E5',
    borderRadius: 7,
    lineHeight: '30px',
    '&:hover': {
      backgroundColor: '#d5d7d5',
    },
  },
  bottomProgressBar: {
    bottom: 0,
    height: 40,
    borderRadius: 10,
    border: '1px solid black'
  },
  ScoreDiv: {
    margin: '30px 80px',
    fontSize: 18,
    fontWeight: 700,
  }
}));

export default function App() {
  const classes = useStyles();
  const [qProgressBar, setqProgressBar] = React.useState(0);
  const [counter, setcounter] = React.useState(1);
  const [options, setoptions] = React.useState([]);
  const [correctQ, setcorrectQ] = React.useState(0);
  const [wrongQ, setwrongQ] = React.useState(0);
  const [correctScore, setcorrectScore] = React.useState(0);
  const [correctMaxScore, setcorrectMaxScore] = React.useState(100);
  const [currentScore, setcurrentScore] = React.useState(0);
  const [disableButton, setdisabledButton] = React.useState(false)
  const [selectOption, setselectOption] = React.useState('');
  const [result, setresult] = React.useState('');
  
  React.useEffect(() => setqProgressBar(Math.floor((counter / Questions.length) * 100)));

  const ratingValue = difficulty => {
    if (difficulty === 'hard')
      return 3;
    if (difficulty === 'medium')
      return 2;
    if (difficulty === 'easy')
      return 1;

    return null;
  }

  //option of question
  React.useEffect(() => {
    const options = []
    options.push(Questions[counter - 1].correct_answer);
    Questions[counter - 1].incorrect_answers.forEach(op => {
      options.push(op)
    });

    // random ordering of questions
    var currentIndex = options.length, temporaryValue, randomIndex;
    if (!disableButton) {
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = options[currentIndex];
        options[currentIndex] = options[randomIndex];
        options[randomIndex] = temporaryValue;
      }
    }
    setoptions(options);
  }, [counter])

  //check ans is correct or wrong
  const checkAns = (selectedOp, correct_answer) => {
    setselectOption(selectedOp);
    setdisabledButton(true)
    if (selectedOp === correct_answer) {
      setcorrectQ(correctQ + 1);
      setresult('Correct!')
    }
    else {
      setwrongQ(wrongQ + 1);
      setresult('Sorry!')
    }
  }

  //changes of percentage on correct Ans
  React.useEffect(() => {
    setcorrectScore(Math.floor((correctQ / Questions.length) * 100));
    let attemptedQ = correctQ + wrongQ;
    setcurrentScore(Math.floor((correctQ / attemptedQ) * 100));
  }, [correctQ])

  //changes of percentage on Wrong Ans
  React.useEffect(() => {
    setcorrectMaxScore(Math.floor(100 - ((wrongQ / Questions.length) * 100)));
    let attemptedQ = correctQ + wrongQ;
    setcurrentScore(Math.floor((correctQ / attemptedQ) * 100));
  }, [wrongQ])

  //change question
  const nextQuestion = () => {
    setcounter(counter + 1);
    setqProgressBar(Math.floor((counter / Questions.length) * 100));
    setdisabledButton(false);
  }

  return (
      <div style={{ backgroundColor: 'rgb(237, 237, 237)', height: '100vh' }}>
        <Card className={classes.card}>
          <div className={classes.progressBar} style={{ width: qProgressBar + '%' }} />
          {Questions.map((question, index) => {
            if (index + 1 === counter)
              return (
                <div className={classes.formDiv}>
                  <div className={classes.questionCoutner}>
                    Question {counter} of {Questions.length}
                  </div>
                  <div className={classes.entertainTitle}>
                    {decodeURIComponent(question.category)}
                  </div>
                  <Rating defaultValue={() => ratingValue(question.difficulty)} max={3} style={{ color: 'rgb(0,0,0)', marginBottom: 40 }} readOnly />
                  <div className={classes.question}>
                    {decodeURIComponent(question.question)}
                  </div>
                  {
                    <Grid container spacing={3} style={{ marginTop: 20 }}>
                      {options.map(op => {
                        return (
                          <Grid item xs={12} md={6} style={{ marginTop: 20, textAlign: 'center', padding: '0xp 20px' }}>
                            <button style={selectOption === op ? {
                              backgroundColor: 'Black',
                              color: 'white'
                            }
                              :
                              op === question.correct_answer && disableButton ? {
                                backgroundColor: 'white',
                                color: 'black'
                              }
                                : null
                            } disabled={disableButton} className={classes.button} onClick={() => checkAns(op, question.correct_answer)}>{decodeURIComponent(op)}</button>
                          </Grid>
                        )
                      })}
                    </Grid>
                  }
                </div>
              )
          })}
          {disableButton &&
            <div style={{ textAlign: 'center', width: '45%', margin: '0 auto' }}>
              <span className={classes.questionCoutner}>
                {result}
              </span>
              <button className={classes.button} style={{ marginTop: 20, lineHeight: '45px' }} onClick={nextQuestion}>Next Question</button>
            </div>
          }
          <div className={classes.ScoreDiv} style={{marginTop: disableButton?'calc(11vw)':'calc(20vw)'}}>
            <span>Score: {currentScore ? currentScore : 0}%</span>
            <span style={{float: 'right'}}>Max Score: {correctMaxScore}%</span>
            <div className={classes.bottomProgressBar}
              style={{ display: 'flex' }}
            >
              <div style={{ width: correctScore + '%', height: 40, backgroundColor: 'rgb(0,0,0)' }} />
              <div style={{ width: currentScore - correctScore + '%', height: 40, backgroundColor: 'rgb(113, 113, 113)' }} />
              <div style={{ width: correctMaxScore - currentScore + '%', height: 40, backgroundColor: 'rgb(210, 210, 210)' }} />
            </div>
          </div>
        </Card>
      </div >
  );
}
