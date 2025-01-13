import { Row, Col, Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { useState, useEffect } from "react";

const DeliveryBookComponent = ({ fetchDeliveryBooks, deleteDeliveryBook }) => {
  const [deliveryBooks, setDeliveryBooks] = useState([]);
  const [deliveryBookDeleted, setDeliveryBookDeleted] = useState(false);

  const deleteHandler = async (deliveryBookId) => {
    if (window.confirm("Are You Sure")) {
      const data = await deleteDeliveryBook(deliveryBookId);
      if (data.message === "Delivery Book Deleted") {
        setDeliveryBookDeleted(!deliveryBookDeleted);
        window.location.reload(false);
      }
    }
  };

  useEffect(() => {
    const abctrl = new AbortController();
    fetchDeliveryBooks(abctrl)
      .then((res) => setDeliveryBooks(res))
      .catch((er) => {
        if (er.code === "ERR_CANCELED") {
          // console.log("Fetch request was cancelled");
        } else if (er.response) {
          console.log(
            er.response.data.message
              ? er.response.data.message
              : er.response.data
          );
        } else {
          console.log(er);
        }
      });
    return () => abctrl.abort();
  }, [deliveryBookDeleted]);

  return (
    <Row className="content-container m-5">
      <Col md={2}>
        <AdminLinksComponent />
      </Col>
      <Col md={10}>
        <h1>
          COMPANY BOOKS{" "}
          <LinkContainer to="/admin/create-new-deliveryBook">
            <Button
              variant="success"
              className="m-0 me-4 ms-4 p-0 pe-1 ps-1"
              size="lg"
            >
              New
            </Button>
          </LinkContainer>
        </h1>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th width="15%">Company Name</th>
              <th width="25%">Billing Email</th>
              <th width="25%">Company Account</th>
              <th width="25%">Sites</th>
              {/* <th width="15%">Uniform</th> */}
              <th width="10%">Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {deliveryBooks.map((book, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{book.companyName}</td>
                <td>{book.billingEmail}</td>
                <td>{book.companyAccount}</td>
                <td>
                  {book.sites.map((site, i) => (
                    <p key={site.id || i}>{site.name}</p>
                  ))}
                </td>
                {/* {book.hasUniform && book.hasUniform === true ? (
                  <>
                    <td>YES</td></>
                ) : (
                  <>
                    <td>NO</td></>
                )} */}
                <td>
                  <LinkContainer to={`/admin/edit-deliveryBook/${book._id}`}>
                    <Button className="btn-sm btn-light">
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  </LinkContainer>
                  {" / "}
                  <Button
                    variant="danger"
                    className="btn-sm btn-light"
                    onClick={() => deleteHandler(book._id)}
                  >
                    <i className="bi bi-x-circle"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default DeliveryBookComponent;
