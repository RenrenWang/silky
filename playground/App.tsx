import {  Input } from "antd";
import "./App.css";
import {  FormProvider, useForm } from "react-hook-form";
import FormItem from "./form-item";
import Autocomplete from '@mui/joy/Autocomplete';

function App() {
  const methods = useForm<any>({
    mode: "all"
  });
  const {
    handleSubmit,
    setValue,
  } = methods;

  const onSubmit = data => {
    console.log(data); // log form field values
  };

  const onClick = () => {
    setValue("firstName", "");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormItem
          name="firstName"
          rules={{
            required: "This is required.",
          }}
          defaultValue=""
        >
          <Autocomplete options={['Option 1', 'Option 2']} />
        </FormItem>

        <FormItem
          name="lastName"
          rules={{
            required: "This is required.",
          }}
        >
          <Input />
        </FormItem>
     

        <button type="submit">Submit</button>
      </form>

      <button onClick={onClick}>change lastName</button>
    </FormProvider>
  );
}

export default App;
