import {useRequest} from '@hooks';
import './App.css'
import { Button, Form } from 'antd';



type Params={
  page:number;
  pageSize:number;
}

function editUsername({username}:{username?:string}): Promise<any> {
  console.log("loading....", username);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // reject({
      //   code: 0,
      //   success:true,
      //   data: {
      //     username: username,
      //     email: "test@test.com",
      //     phone: "12345678901",
      //     avatar: "https://xxx.jpg",
      //     updateTime: new Date().toISOString(),
      //     role: "admin"
      //   }
      // });
      //有五分之一的几率会报错
      if(Math.random()<0.8){
        reject(new Error("simulated request failure"))
      }
      resolve({
        code: 0,
        success:true,
        data: {
          username: username,
          email: "test@test.com",
          phone: "12345678901",
          avatar: "https://xxx.jpg",
          updateTime: new Date().toISOString(),
          role: "admin"
        }
      });
    }, 1000);
  });
}


function App() {
  const [form] = Form.useForm();
  const { data, run, loading } = useRequest(editUsername, {
    auto: true,
    loadingDelay: 300,
    retry:true,
    cacheKey:'editUsername',
    debounceTime:300,
    maxRetries:10,
    onSuccess: (data: any) => {
      console
    },
    params: [
      {
        username:'2323'
      }
    ]
  });
  

  const onClick=async ()=>{
    try {
      const result = await run({
        username: "test",
      });
      console.log("onClick=====>success", result);
    } catch (e) { 
      console.log("onClick=====>e", e);
    }finally{
      console.log("onClick=====>finally");
    }
  }
  
  return (
    <Form form={form} component={false}>
      <div>
        {JSON.stringify(data)}
      </div>
      <Button loading={loading} onClick={onClick}>submit</Button>
    </Form>
  )
}

export default App
