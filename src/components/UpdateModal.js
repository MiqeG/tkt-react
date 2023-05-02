import React, { useRef } from "react";
import { Button, Modal } from "semantic-ui-react";
import UpdateForm from "./UpdateForm";
function UpdateModal(props) {
  const [open, setOpen] = React.useState(true);
  const [deletedEntreprise, setDeletedEntreprise] = React.useState(false);
  const childRef = useRef();
  const deleted = () => {
    setDeletedEntreprise(true);
  };
  const conditionalSubmit = () => {
    if (!deletedEntreprise) {
      return (
        <Button
          basic
          icon
          labelPosition="left"
          onClick={() => childRef.current.handleSubmit()}
        >
          <i className="cloud upload teal icon"></i>
          Update
        </Button>
      );
    }
  };
  const conditionalDelete = () => {
    if (!deletedEntreprise) {
      return (
        <Button
          basic
          icon
          labelPosition="left"
          onClick={() => {
            childRef.current.delete();
          }}
        >
          <i className="times red icon"></i>
          Delete
        </Button>
      );
    }
  };
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>
        <i className="cloud upload teal icon"></i> Edit Entreprise
      </Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <UpdateForm
            item={props.item}
            updateItemInTable={props.updateItemInTable}
            deleteRow={props.deleteRow}
            ref={childRef}
            deleted={deleted}
          ></UpdateForm>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        {conditionalSubmit()}
        {conditionalDelete()}
        <Button
          basic
          icon
          labelPosition="left"
          onClick={() => {
            props.close();
            setOpen(false);
          }}
        >
          <i className="times icon red"></i> Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
export default UpdateModal;
