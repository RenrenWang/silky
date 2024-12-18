import { Radio, Select } from "antd";
import "./App.css";
import { FormProvider, useForm } from "react-hook-form";
import FormItem from "./form-item";
import { useEffect } from "react";
import { Input } from "@mui/joy";
import NumberInput from "./number-input";

function App() {
  const methods = useForm<any>({
    mode: "all",
    defaultValues:{
      type:null
    }
  });

  const { handleSubmit, setValue, watch} = methods;

  const onSubmit = data => {
    console.log(data); 
  };

  const onClick = () => {
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
