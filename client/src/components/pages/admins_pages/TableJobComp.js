import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import server from '../../../API/server'
import AddItem from './table_components/AddItem'
import UpdateItem from './table_components/UpdateItem'
import ModalComp from './table_components/ModalComp'
import DeleteModalComp from './table_components/DeleteModalComp'

const TableJobComp = (props) => {
    const [selectedId, setSelectedId] = useState(0);
    const [jobList, setJobList] = useState([]);
    const [selectedIdValues, setSelectedIdValues] = useState([]);
    const [modalText, setModalText] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [modalMessage, setModalMessage] = useState([]);

    //MODALS
    const [show, setShow] = useState(false);
    const [modalDeleteShow, setModalDeleteShow] = useState(false);

    //UpdateTableField
    const [updateValue, setUpdateValue] = useState(true);

    //fields
    const [status, setStatus] = useState('');
    const [end_date, setEndDate] = useState('');
    const [start_date, setStartDate] = useState('');
    const [employee_id, setEmployeeId] = useState('');

    useEffect(() => {
        const search = async (path, func) => {
            const { data } = await server.get(path, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('access_token')
                }
            });
            func(data);
        }
        search('/jobs', setJobList);
    }, [updateValue]);

    const tableHeaders = ['Status', 'Start_date', 'End_date', 'Employee_id'];
    const tableName = 'job';
    const tableSetters = [setStatus, setStartDate, setEndDate, setEmployeeId];
    const tableValues = [status, start_date, end_date, employee_id];

    const jobFields = ['Status', 'Start_date', 'End_date', 'Employee_id', 'Services']

    const createItem = (valuesOfInputs) => {
        const addQuery = async (path, func) => {
            const { data } = await server.post(path, valuesOfInputs, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('access_token')
                }
            });
            setJobList([...jobList, data]);
        }
        addQuery('/jobs').then(() => {
            setUpdateValue(!updateValue);
            props.updateAdminsPage();
            changeStateOfModal();
            setModalText("Success! Data was updated successfully.");
            setModalMessage(["No errors"])
        }).catch((err) => {
            if (err.response.status == 401 || err.response.status == 403) {
                setModalMessage(["You don't have enough rights"])
            } else {
                setModalMessage(err.response.data.message)
            }
            changeStateOfModal();
            setModalText("Error! Can't make query. Error:");
        })
    };

    const changeStateOfModal = () => {
        setShow(!show);
    }

    const changeStateOfDeleteModal = () => {
        setModalDeleteShow(!modalDeleteShow);
    }

    const updateItem = (valuesOfInputs) => {
        const addQuery = async (path, func) => {
            const { data } = await server.put(path, valuesOfInputs, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('access_token')
                }
            });

        }
        addQuery('/jobs').then(() => {
            setUpdateValue(!updateValue);
            props.updateAdminsPage();
            changeStateOfModal();
            setModalText("Success! Data was updated successfully.");
            setModalMessage(["No errors"])
        }).catch((err) => {
            if (err.response.status == 401 || err.response.status == 403) {
                setModalMessage(["You don't have enough rights"])
            } else {
                setModalMessage(err.response.data.message)
            }
            changeStateOfModal();
            setModalText("Error! Can't make query. Error:");
        })
    }

    const deleteItem = () => {
        const addQuery = async (path, func) => {
            const { data } = await server.delete(`${path}/${selectedId}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('access_token')
                }
            });
        }
        //ДОБАВИТЬ УДАЛЕНИЕ ИЗ ТАБЛИЦЫ
        addQuery('/jobs').then(() => {
            setUpdateValue(!updateValue);
            props.updateAdminsPage();
            changeStateOfModal();
            setModalText("Success! Item was deleted successfully.");
            setModalMessage(["No errors"])
        }).catch((err) => {
            if (err.response.status == 401 || err.response.status == 403) {
                setModalMessage(["You don't have enough rights"])
            } else {
                setModalMessage(err.response.data.message)
            }
            changeStateOfModal();
            setModalText("Error! Can't make query. Error:");
        })
    }
    const renderedItems = jobList.map((item, index) => {
        return (
            <tr key={index}>
                <td>{item.status}</td>
                <td>{item.start_date}</td>
                <td>{item.end_date}</td>
                <td>{item.employee.last_name}</td>
            </tr>
        )
    });

    const objectToArray = (object) => {
        let array1 = [];
        let array2 = [];
        let counter1 = 0;
        let counter2 = 0;
        for (let key in object) {
            if (key != "id") {
                array1[counter1++] = object[key];
            }
            array2[counter2++] = object[key];
        }
        return {
            ar1: array1,
            ar2: array2
        };
    }

    return (
        <div>
            <ModalComp show={show} modalText={modalText} modalMessage={modalMessage} changeStateOfModal={changeStateOfModal}></ModalComp>
            <DeleteModalComp modalDeleteShow={modalDeleteShow} changeStateOfDeleteModal={changeStateOfDeleteModal} deleteItem={deleteItem}></DeleteModalComp>
            <Container>
                <Row>
                    <Col>
                        <Table striped bordered hover variant="dark" onClick={(e) => {
                            let target = e.target;

                            if (target.tagName != 'TD') {

                            } else {
                                // const parent = target.parentElement;
                                // const identifier = parent.firstChild.innerHTML;
                                // setSelectedId(identifier);

                                // let array = [];
                                // for (var i = 0; i < parent.children.length; i++) {
                                //     array[i] = parent.children[i].innerHTML;

                                //     if (i != 0) {
                                //         tableSetters[i - 1](parent.children[i].innerHTML);
                                //     }
                                // }
                                // setSelectedIdValues(array);

                                const parent = target.parentElement;
                                const identifier = parent.firstChild.innerHTML;


                                let arraysObj = objectToArray(jobList[parent.rowIndex - 1]);


                                setSelectedId(arraysObj.ar2[0]);

                                for (let i = 0; i < parent.children.length; i++) {
                                    tableSetters[i](arraysObj.ar1[i]);
                                }

                                setSelectedIdValues(arraysObj.ar2);
                                setSelectedItem(jobList[parent.rowIndex - 1]);
                            }
                        }}>
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>End date</th>
                                    <th>Start date</th>
                                    <th>Employee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderedItems}
                            </tbody>
                        </Table>
                        <br></br>
                        <Row>
                            <Col>
                                <AddItem updateValue={props.updateValue} createItem={createItem} tableHeaders={jobFields} tableName={tableName}></AddItem>
                            </Col>
                            <Col>
                                {selectedId ? <UpdateItem selectedItem={selectedItem} updateItem={updateItem} tableHeaders={jobFields} tableName={tableName} selectedId={selectedId} selectedIdValues={selectedIdValues} tableSetters={tableSetters} tableValues={tableValues}></UpdateItem> : ""}
                            </Col>
                        </Row>
                        <Row>
                            {selectedId ?
                                <Card>
                                    <Card.Header>Delete item</Card.Header>
                                    <Card.Body>
                                        <Card.Title>{`Delete job with status  = ${selectedIdValues[1]} and end_date ${selectedIdValues[2]}?`}</Card.Title>
                                        <Card.Text>
                                            This item will be deleted.
                                        </Card.Text>
                                        <Button variant="primary" onClick={(e) => { setModalDeleteShow(!modalDeleteShow) }}>Delete</Button>
                                    </Card.Body>
                                </Card> : ""}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default TableJobComp;