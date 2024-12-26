import useDeepCompareEffect from "@hooks/use-deep-compare-effect";
import { Col, Input, Radio, Row } from "antd";
import { useState } from "react";

const InputRadio = ({onChange,value:propValue}:any) => {
  const [value, setValue] =useState({});



  useDeepCompareEffect(()=>{
    setValue?.(propValue)
  },[propValue]);

  const onRadioChange = (e) => {
    const newValue={
        ...value,
         radio: Number(e.target.value)
       };
    setValue(newValue);

    onChange?.(newValue)
  };

  const onInputChange=(e)=>{
    const newValue={
        ...value,
        input: e.target.value
     };
     setValue(newValue);
     onChange?.(newValue)
  }

  return (
    <Row>
      <Col>
        <Radio.Group onChange={onRadioChange}>
          <Radio value={1}>1</Radio>
          <Radio value={2}>2</Radio>
        </Radio.Group>
      </Col>
      <Col>
        <Input onChange={onInputChange} />
      </Col>
    </Row>
  );
};

export default InputRadio;
