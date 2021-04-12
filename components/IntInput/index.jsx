import PropTypes from "prop-types";

const typeMap = {
  int: {
    pattern: "[0-9]*",
    inputInterceptor(e) {
      if(!e.target.validity.valid) {
        window.alert('只能输入正整数')
        return false
      }
      return true
    }
  }
}

export default function IntInput(props) {
  return (
    <input
      // {...props}
      pattern={typeMap[props.type].pattern}
      value={props.value}
      onChange={(e)=>{
        const filterFn = typeMap[props.type].inputInterceptor;
        if(filterFn && !filterFn(e)) {
          return;
        }
        props.onChange(e)
      }}
    />
  );
}


IntInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  type: PropTypes.string
};

IntInput.defaultProps = {
  type: 'int'
}