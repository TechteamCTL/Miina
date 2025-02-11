import { Row, Col, Table, Button, Form, InputGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminLinksComponent from "../../../components/admin/AdminLinksComponent";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FetchAuthFromServer from "../../../components/Utils/FetchAuthFromServer";
import styles from "../AdminPagesStyles.module.css";

const UsersPageComponent = ({ fetchUsers, deleteUser }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userDeleted, setUserDeleted] = useState(false);
  const [emailFilter, setEmailFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [emailDomains, setEmailDomains] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUnverified, setShowUnverified] = useState(false);
  const { userInfo } = useSelector((state) => state.userRegisterLogin);
  const isAuth = FetchAuthFromServer();
  const accessRoles = ["isAdmin"];

  const hasAnyRole = (userInfo, accessRoles) => {
    return accessRoles.some((role) => {
      return (
        userInfo.hasOwnProperty(role.trim()) && Boolean(userInfo[role.trim()])
      );
    });
  };

  const deleteHandler = async (userId) => {
    if (window.confirm("Are you sure?")) {
      const data = await deleteUser(userId);
      if (data === "user removed") {
        setUserDeleted(!userDeleted);
      }
    }
  };

  useEffect(() => {
    const abctrl = new AbortController();
    fetchUsers(abctrl)
      .then((res) => {
        const sortedOrders = res.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setUsers(sortedOrders);
      })
      .catch((er) => {
        if (er.code === "ERR_CANCELED") {
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
  }, [userDeleted]);

  useEffect(() => {
    const isFilterMatched = (user) => {
      const emailDomain = user.email?.split("@")[1]?.toUpperCase() || "";
      const userCompany = user.company?.toUpperCase() || "";
      const userLocation = user.location?.toUpperCase() || "";
      const userName = user.name?.toUpperCase() || "";
      const userLastName = user.lastName?.toUpperCase() || "";
      const userEmail = user.email?.toUpperCase() || "";
      const isEmailMatched =
        emailFilter === "" || emailDomain === emailFilter.toUpperCase();
      const isCompanyMatched =
        companyFilter === "" || userCompany === companyFilter.toUpperCase();
      const isLocationMatched =
        locationFilter === "" || userLocation === locationFilter.toUpperCase();
      const isSearchMatched =
        userName.includes(searchTerm.toUpperCase()) ||
        userLastName.includes(searchTerm.toUpperCase()) ||
        userEmail.includes(searchTerm.toUpperCase());
      const isVerificationMatched = !showUnverified || user.verified !== true;

      return (
        isEmailMatched &&
        isCompanyMatched &&
        isLocationMatched &&
        isSearchMatched &&
        isVerificationMatched
      );
    };

    const filteredUsers = users.filter(isFilterMatched);
    setFilteredUsers(filteredUsers);

    const emailDomains = [
      ...new Set(
        filteredUsers.map(
          (user) => user.email?.split("@")[1]?.toUpperCase() || ""
        )
      ),
    ].sort();
    setEmailDomains(emailDomains);

    const companies = [
      ...new Set(
        filteredUsers.map((user) => user.company?.toUpperCase() || "")
      ),
    ].sort();
    setCompanies(companies);

    const locations = [
      ...new Set(
        filteredUsers.map((user) => user.location?.toUpperCase() || "")
      ),
    ].sort();
    setLocations(locations);
  }, [
    users,
    emailFilter,
    companyFilter,
    locationFilter,
    searchTerm,
    showUnverified,
  ]);

  const resetFilters = () => {
    setEmailFilter("");
    setCompanyFilter("");
    setLocationFilter("");
    setSearchTerm("");
    setShowUnverified(false);
  };
  return (
    <Row className="content-container m-0 admin-order-page">
      <Col md={2}>
        <AdminLinksComponent />
      </Col>
      <Col md={10} className="admin-page-users">
        <h1>
          USERS{" "}

        </h1>
        <Form >
          <Row style={{display: "flex", alignItems: "center"}}>
            <Col>
              <Form.Select
                aria-label="Email filter"
                onChange={(e) => setEmailFilter(e.target.value)}
                value={emailFilter}
              >
                <option value="">Select Email Domain</option>
                {emailDomains.map((domain, idx) => (
                  <option key={idx} value={domain}>
                    {domain}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Select
                aria-label="Company filter"
                onChange={(e) => setCompanyFilter(e.target.value)}
                value={companyFilter}
              >
                <option value="">Select Company</option>
                {companies.map((company, idx) => (
                  <option key={idx} value={company}>
                    {company.toUpperCase()}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Select
                aria-label="Location filter"
                onChange={(e) =>
                  setLocationFilter(e.target.value.toUpperCase())
                }
                value={locationFilter}
              >
                <option value="">Select Location</option>
                {locations.map((location, idx) => (
                  <option key={idx} value={location}>
                    {location.toUpperCase()}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Button
                onClick={resetFilters}
                className={`m-0 p-0 pe-1 ps-1 ${styles.btnGreenColor}`}
              >
                Reset Filters
              </Button>
            </Col>
          </Row>
          <Row className="m-1">
            <Form.Check
              type="checkbox"
              label="Unverified"
              onChange={(e) => setShowUnverified(e.target.checked)}
              checked={showUnverified}
            />
          </Row>
        </Form>

        <Table striped bordered hover responsive className="mt-2">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Location</th>
              <th>
                <i className="bi bi-person-check"></i>
              </th>
              <th>Registered Date</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{user.name}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.company}</td>
                <td>{user.location}</td>
                <td>
                  {user.verified ? (
                    <i className="bi bi-check-lg text-success"></i>
                  ) : (
                    <i className="bi bi-x-lg text-danger"></i>
                  )}
                </td>
                <td>{user.createdAt.substring(0, 10)}</td>
                <td>
                  <LinkContainer to={`/admin/edit-user/${user._id}`}>
                    <Button
                      className="btn-sm btn-light"
                      disabled={!hasAnyRole(isAuth, accessRoles)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  </LinkContainer>

                  {" / "}
                  <Button
                    variant="danger"
                    className="btn-sm btn-light"
                    onClick={() => deleteHandler(user._id)}
                    disabled={!hasAnyRole(isAuth, accessRoles)}
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

export default UsersPageComponent;
