import React from "react";
import { Button, Icon, Modal } from "semantic-ui-react";
import AddForm from "./AddForm";
function ModalExampleModal(props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button icon labelPosition="left" basic>
          <Icon name="cloud upload" color="green" />
          {props.buttonName}
        </Button>
      }
    >
      <Modal.Header>
        <i className="cloud upload green icon"></i> Add Entreprise
      </Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <AddForm></AddForm>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button basic icon labelPosition="left" onClick={() => setOpen(false)}>
          <i className="times icon red"></i> Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
export default ModalExampleModal;