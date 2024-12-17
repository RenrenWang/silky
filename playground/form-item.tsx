import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";

type FormItemProps={
    name:string;
    children:React.ReactElement;
    rules?:RegisterOptions;
    defaultValue?:any
};

const FormItem = (props: FormItemProps) => {
  const { name,rules, children, ...rest } = props;

  const {
    control,
    formState: { errors }
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        return (
          <div>
            {React.cloneElement(children, { ...field, ...rest })}
            <ErrorMessage errors={errors} name={field?.name} render={({ message }) => <span style={{color:'red'}}>{message}</span>}/>
          </div>
        );
      }}

      {...rest}
    />
  );
};

export default FormItem;