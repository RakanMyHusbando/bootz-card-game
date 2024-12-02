export const execute = async (db,query) => {
    return new Promise((reso,reje)=>{
        db.exec(query,(err)=>{
            if(err) reje(err)
            else reso(err)
        })
    })
}