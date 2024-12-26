import classNames from "classnames";
import React from "react";
import { Controller, RegisterOptions, useFormContext } from "react-hook-form";
import useFormError from './use-form-errors'
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
 const {getErrors}=useFormError(errors);

  const getError = (fieldName:string) => {
    return getErrors(fieldName)?.[0] || '';
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        return (
          <div  className={classNames('form-item')}>
            {React.cloneElement(children, { ...field, ...rest })}
            <div className="form-item-error" >{getError(field?.name)}</div>
          </div>
        );
      }}

      {...rest}
    />
  );
};

export default FormItem;