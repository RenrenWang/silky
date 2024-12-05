import {useRequest} from '@hooks';
import './App.css'
import { Button, Form } from 'antd';



type Params={
  page:number;
  pageSize:number;
}

function editUsername(username: string): Promise<string> {
  console.log(username);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve("Please enter a username");
      } else {
        reject('Failed to modify username');
      }
    }, 200);
  });
}


function App() {
 
  const [form] = Form.useForm();
  const { data, loading, run } = useRequest<string, string>(editUsername, {
    loadingThreshold: 300,
    cacheKey: 'username',
    cacheExpiration: 1000 * 3,
  });


  const onClick=()=>{
     run('3232')
  }
  
  return (
    <Form  form={form} component={false}>
       <div>{JSON.stringify(data)}</div>
      <Button loading={loading} onClick={onClick}>submit</Button>

    </Form>
  )
}

export default App
