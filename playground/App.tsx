import './App.css'
import { useRequest } from '../src';
import { Button, Form } from 'antd';
import { useState } from 'react';


type Params={
  page:number;
  pageSize:number;
}
function editUsername(username: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve();
      } else {
        reject(new Error('Failed to modify username'));
      }
    }, 1000);
  });
}


const useValidator = () => {
  const service= function(params:Params):Promise<any> {
    console.log(params,'params')
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve({
            code:0,
            data:[]
          })
        } else {
          reject(new Error('Failed to modify username'));
        }
      }, 1000);
    });
  }

  const check=()=>async (rule, value) => {
    const res = await service({ page: 1, pageSize: 10 });
    console.log(res);
    if (!res) {
      return Promise.reject('Failed to modify username');
    
    }
    return Promise.resolve();
  }
  
  return { check }
}
function App() {
 
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { check}=useValidator()
  const onClick = async () => {
    try {
     setLoading(true);
      const res = await form.validateFields()
      
     console.log(res);
   } catch (error) {
    console.log("error",error);
   } finally {
      console.log("finally");
      setLoading(false);
   }
   

 }
  return (
    <Form  form={form} component={false}>
      <Form.Item name="username" noStyle rules={[{
        validator:check()}]}>
        <input type="text" placeholder="Username" />
      </Form.Item>
      <Button loading={loading} onClick={onClick}>submit</Button>

    </Form>
  )
}

export default App
