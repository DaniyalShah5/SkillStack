const cardStyle={
    width: '100%',
    height:'auto',
    border:'1px solid rgb(148 163 184 )',
    
    flexDirection:'column',
    overflow:'hidden',
    borderRadius:'10px',
    padding:'8px'

};
const cardImage={
    width:'100%',
    height:'auto',
    objectFit:'cover',
    padding:'3px',
    borderRadius:'10px',
    overflow:'hidden',

};
const cardTitle={
    fontSize:'1rem',
    color:'#333',
    padding:'3px'
};
const cardDescription={
    fontSize:'.8rem',
    color:'#666',
    padding:'3px'
}


function Card ({image,title,description,className }){
    return (
        <div style={cardStyle} className={`${className}`} >
            <img src={image} style={cardImage} />
            <h3 style={cardTitle}>{title}</h3>
            <p style={cardDescription}>{description}</p>
        </div>
    )
}

export default Card;