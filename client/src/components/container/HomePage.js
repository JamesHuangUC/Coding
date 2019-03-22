import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Button } from 'react-bootstrap';
// import faker from "faker";
import * as challengesActions from '../../actions/challengesActions';
import * as userActions from '../../actions/userActions.js';
import ChallengesList from '../presentational/ChallengesList';
import ChooseUserName from '../presentational/ChooseUserName';

class HomePage extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = { validated: false };
  }

  componentDidMount() {
    if (parseInt(this.props.challenges.length) === 0) {
      this.props.actions.getChallenges();
    }
  }

  chooseUserName(userName) {
    this.props.actions.assignUserName(userName);
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();

      const userName = form.validationUser.value;
      const roomName = form.validationRoom.value;
      this.props.actions.assignUserName(userName);
      this.props.history.push(`rooms/${roomName}`);
    }
    this.setState({ validated: true });
  }

  // render() {
  //   return (
  //     <div>
  //       <ChooseUserName
  //         userName={this.props.userName}
  //         chooseUserName={this.chooseUserName.bind(this)}
  //       />

  //       <ChallengesList challenges={this.props.challenges} />
  //     </div>
  //   );
  // }

  render() {
    const { validated } = this.state;
    return (
      <div
        style={{
          background:
            'radial-gradient(rgba(9,156,236,.87) 0, rgba(6, 109, 165, .87))',
          height: '100vh'
        }}
      >
        <div
          style={{
            margin: 0,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          className="text-center"
        >
          <p className="h3 mb-3 font-weight-normal" style={{ color: '#FFF' }}>
            Coding
          </p>
          <Form
            noValidate
            validated={validated}
            onSubmit={e => this.handleSubmit(e)}
          >
            <Form.Group md="4" controlId="validationUser">
              {/*<Form.Label>Username</Form.Label>*/}
              <Form.Control
                required
                type="text"
                placeholder="Username"
                // id="username"
                // defaultValue={faker.internet.userName()}
              />
              {/*<Form.Control.Feedback>Looks good!</Form.Control.Feedback>*/}
            </Form.Group>
            <Form.Group md="4" controlId="validationRoom">
              {/*<Form.Label>Room name</Form.Label>*/}
              <Form.Control
                required
                type="text"
                placeholder="Room name"
                // id="roomname"
                // defaultValue="Otto"
              />
              {/*<Form.Control.Feedback>Looks good!</Form.Control.Feedback>*/}
            </Form.Group>

            <Button type="submit" variant="primary" size="lg" block>
              Enter
            </Button>
          </Form>

          {/*<Form>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Control type="text" placeholder="Username" />
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlInput2">
            <Form.Control type="text" placeholder="Room name" />
          </Form.Group>

          <Button variant="primary" type="submit" size="lg" block>
            Enter
          </Button>
        </Form>
      */}
        </div>
      </div>
    );
  }

  // render() {
  //     const { validated } = this.state;
  //     return (
  //       <Form
  //         noValidate
  //         validated={validated}
  //         onSubmit={e => this.handleSubmit(e)}
  //       >
  //         <Form.Row>
  //           <Form.Group md="4" controlId="validationCustom01">
  //             {/*<Form.Label>Username</Form.Label>*/}
  //             <Form.Control
  //               required
  //               type="text"
  //               placeholder="Username"
  //               // defaultValue={faker.internet.userName()}
  //             />
  //             <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  //           </Form.Group>
  //           <Form.Group md="4" controlId="validationCustom02">
  //             {/*<Form.Label>Room name</Form.Label>*/}
  //             <Form.Control
  //               required
  //               type="text"
  //               placeholder="Room name"
  //               // defaultValue="Otto"
  //             />
  //             <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
  //           </Form.Group>

  //         </Form.Row>

  //         <Button type="submit">Enter</Button>
  //       </Form>
  //     );
  //   }
}

function mapStateToProps(state) {
  return { challenges: state.challenges, userName: state.currentUser };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      Object.assign(userActions, challengesActions),
      dispatch
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
