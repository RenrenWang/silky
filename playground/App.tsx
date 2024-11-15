import './App.css'
import { useRequest } from '../src';


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

function App() {
  const {data,loading,runSync}=useRequest(service,{
    manual:true,
  }); 
   
  return (
    <>
    
     <a onClick={()=>{
      runSync({page:1,pageSize:10});
     }}>getData</a>
     {loading?<p>Loading...</p>:<p>{JSON.stringify(data)}</p>}
    </>
  )
}

export default App
