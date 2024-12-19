import { Radio, Select } from "antd";
import "./App.css";
import { FormProvider, useForm } from "react-hook-form";
import FormItem from "./form-item";
import { useEffect, useState } from "react";
import { Input } from "@mui/joy";
import NumberInput from "./number-input";
import useImagesPreloader from "@hooks/use-images-preloader";

function App() {
  const methods = useForm<any>({
    mode: "all",
    defaultValues:{
      type:null
    }
  });
  // useImagesPreloader([
  //   'http://gips3.baidu.com/it/u=3886271102,3123389489&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960'
  // ])
  const { handleSubmit, setValue, watch} = methods;
  const [show,setShow]=useState(false);
  const onSubmit = data => {
    console.log(data); 
  };

  const onClick = () => {
    setShow((show)=>!show)
    setValue("firstName", "");
  };

  const type = watch("type");
  const radio = watch("radio");

  useEffect(
    () => {
      if(type){
        setValue("radio", type);
      }
    },
    [type]
  );



  
  useEffect(
    () => {
      if(type!==radio){
        setValue("type", null);
      }
    },
    [radio]
  );


  return (
    <FormProvider {...methods}>
      {show?<div className="bg" style={{width:1280,height:960,backgroundImage:'url(http://gips3.baidu.com/it/u=3886271102,3123389489&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960)'}}></div>:null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormItem
          name="type"
          rules={{
            required: "This is required."
          }}
          defaultValue={"apple"}
        >
          <Select
            options={[
              { label: "Apple", value: "apple" },
              { label: "Orange", value: "orange" },
              { label: "Banana", value: "banana" }
            ]}
          />
        </FormItem>

        <FormItem
          name="radio"
          rules={{
            required: "This is required."
          }}
        >
          <Radio.Group options={["apple", "orange", "banana"]} />
        </FormItem>
        <FormItem
          name="joyInput"
          rules={{
            required: "This is required."
          }}
        >
         <Input   />
        </FormItem>

        <FormItem name="amount">
          <NumberInput/>
        </FormItem>
        
        <button type="submit">Submit</button>
      </form>

      <button onClick={onClick}>change lastName</button>
    </FormProvider>
  );
}

export default App;
