import '../index.css'

const Notification = ({messaage, type}) => {
    if(!messaage)  {
        console.log('no success', messaage);
        return null;
    } 
    return (
        <div className={type !== "error" ? 'success': 'error'}>
            {messaage}
        </div>
    )
};


export default Notification;