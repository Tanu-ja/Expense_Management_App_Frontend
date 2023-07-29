import React,{useState,useEffect} from 'react'
import Layout from '../components/layout/Layout'
import { Input, Modal, Form, Select,message, Table } from 'antd';
import axios from 'axios';
import Spinner from '../components/Spinner';


const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [loading,setLoading] = useState(false)
    const [allTransaction, setAllTransaction] = useState([])
    const [frequency,setFrequency] = useState('7')

    //table data

    const columns = [
        {
            title:'Date',
            dataIndex:'date'
        },
        {
            title:'Amount',
            dataIndex:'amount'
        },
        {
            title:'Tp',
            dataIndex:'tp'
        },
        {
            title:'Category',
            dataIndex:'category'
        },
        {
            title:'Refrence',
            dataIndex:'refrence'
        },
        {
            title:'Action',
        },
    ]

    //Get all transactions
    
     //useEffect Hook
     useEffect(() =>{
        const getAllTransaction = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'))
                setLoading(true)
                const res= await axios.post('/transactions/get-transaction',{
                    userid: user._id,
                    frequency
                })
                setLoading(false)
                setAllTransaction(res.data)
                console.log(res.data)
            } catch (error) {
             console.log(error)
                message.error('Fetch Issue with Transaction')
    
            }
        };
       getAllTransaction();
     }, [frequency] )

    //form handling
    const handleSubmit = async(value) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            setLoading(true)
            await axios.post('/transactions/add-transaction',{...value,userid:user._id})
            setLoading(false)
            message.success('Transaction added Successfully')
            setShowModal(false)

            
        } catch (error) {
            setLoading(false)
            message.error('failed to add transaction')
            
        }
    }
    return(
      
        
        <Layout>
            {loading && <Spinner />}
            <div className="filters">
                <div>
                    <h6>Select Frequency</h6>
                    <Select value={frequency} onChange={(values) => setFrequency(values)}>
                        <Select.Option value="7">Last 1 Week</Select.Option>
                        <Select.Option value="30">Last 1 Momth</Select.Option>
                        <Select.Option value="365">Last 1 Year</Select.Option>
                        <Select.Option value="custom">custom</Select.Option>
                    </Select>
                </div>
                <div><button className="btn btn-primary"
                 onClick={() => setShowModal(true)}
                 >
                    Add New
                    </button>
                    </div>

            </div>
            <div className="content">
                <Table columns={columns} dataSource={allTransaction} />
            </div>
           { /*if any error occours change open into visible*/}
            <Modal title="Add Transaction"
             open={showModal} onCancel={() => setShowModal(false)}
             footer={false}
             >
      
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="Amount" name="amount">
                    <Input type="text" />
                </Form.Item>
                <Form.Item label="type (income/expense)" name="tp">
                    <Select>
                        <Select.Option value="income">Income</Select.Option>
                        <Select.Option value="expense">Expense</Select.Option>
                    </Select>

                </Form.Item>
            
                <Form.Item label="Category" name="category">
                    <Select>
                        <Select.Option value="salary">salary</Select.Option>
                        <Select.Option value="tip">tip</Select.Option>
                        <Select.Option value="project">project</Select.Option>
                        <Select.Option value="food">Food</Select.Option>
                        <Select.Option value="movie">Movie</Select.Option>
                        <Select.Option value="bills">Bills</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Date" name="date">
                    <Input type ="date"/>
                </Form.Item>
                <Form.Item label="Refrence" name="refrence">
                    <Input type ="text"/>
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input type ="text"/>
                </Form.Item>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                        {""}
                    SAVE</button>
                </div>

    </Form>
            </Modal>
        </Layout>
    )
}

export default HomePage