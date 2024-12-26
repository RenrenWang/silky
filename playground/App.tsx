import {  Radio, Select } from "antd";
import "./App.css";
import { FormProvider, useForm } from "react-hook-form";
import FormItem from "./form-item";
import InputRadio from "./items";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Define a Yup schema with multiple fields
const schema = Yup.object().shape({
  inputRadio: Yup.object().shape({
    radio: Yup.number().required("radio is required."),
    input: Yup.string().trim().required("input is required.").email("input is not valid email."),
  }).required("This is required."),
  name: Yup.lazy(value=>{
    if (typeof value === "string") {
      return Yup.string().trim().required("name is required.");
    }if(typeof value === "object"){
      return Yup.object().shape({
        value: Yup.string().trim().required("label is required.")
      }).required("name is required.")
    }
    return Yup.array().of(Yup.object().shape({
      label: Yup.string().trim().required("label is required."),
    })).required("name is required.");
  }),

  // Yup.object().shape({
  //   label: Yup.string().trim().required("label is required.")
  // }).required("name is required."),
});

function App() {
  const methods = useForm<any>({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const { handleSubmit} = methods;

  const onSubmit = data => {
    console.log(data); 
  };



  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormItem
          name="name"
          rules={{
            required: "This is required."
          }}
        >
          <Select
         labelInValue
            options={[
              { label: "Apple", value: "" },
              { label: "Orange", value: "orange" },
              { label: "Banana", value: "banana" }
            ]}
          />
        </FormItem>

         <FormItem
          name="inputRadio"
        >
          <InputRadio/>
        </FormItem>
        <button type="submit">Submit</button>
      </form>

    </FormProvider>
  );
}

export default App;

