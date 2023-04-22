import React from "react";
import { Message } from "semantic-ui-react";

const MessageSuccessError = (props) => {
  if (props.message)
    return (
      <Message
        negative={props.message.negative}
        positive={props.message.positive}
      >
        <Message.Header>{props.message.title}</Message.Header>
        <p>{props.message.text}</p>
      </Message>
    );
  else return "";
};

export default MessageSuccessError;
