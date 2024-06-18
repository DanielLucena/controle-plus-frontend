type ButtonsProps = {
  login: () => void;
  logout: () => void;
  isLoggedIn: boolean;
};

function Buttons(props: ButtonsProps) {
  return (
    <div className="row">
      <div className="col-md-12 text-center" style={{ marginTop: '30px' }}>
        {!props.isLoggedIn && (
          <button className="btn btn-primary" style={{ margin: '10px' }} onClick={props.login}>
            Login
          </button>
        )}
        {props.isLoggedIn && (
          <button className="btn btn-dark" style={{ margin: '10px' }} onClick={props.logout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Buttons;
