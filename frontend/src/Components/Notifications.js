import '../index.css'

const Notification = ({messaage, type}) => {
    if(!messaage)  {
        return null;
    } 
    return (
        <div className={type !== "error" ? 'success': 'error'}>
            {messaage}
        </div>
    )
};


export default Notification;