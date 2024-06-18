type LoggedInWelcomeContentProps = {
    username: string;
};

const LoggedInWelcomeContent: React.FC<LoggedInWelcomeContentProps> = ({ username }) => {
    return (
        <div className="row justify-content-md-center">
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h1 className="display-4">Bem vindo, {username}!</h1>
                    <p className="lead">Você agora está logado.</p>
                </div>
            </div>
        </div>
    );
};
export default LoggedInWelcomeContent;
