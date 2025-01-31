const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

const video = document.getElementById('video-element')
const image = document.getElementById('img-element')
const captureBtn = document.getElementById('capture-btn')


if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
    .then((stream) => {
        video.srcObject = stream
        const {height, width} = stream.getTracks()[0].getSettings()
        
        captureBtn.addEventListener('click', e=> {
            for (let i = 0; i < 10; i++) {      
            e.preventDefault()
            
            const track = stream.getVideoTracks()[0]
            const imageCapture = new ImageCapture(track)
            
            imageCapture.takePhoto().then(blob => {
                
                const img = new Image(width, height)
                img.src = URL.createObjectURL(blob)

                const reader = new FileReader()

                reader.readAsDataURL(blob)
                reader.onloadend = () => {
                    const base64data = reader.result
                    console.log(base64data)

                    const fd = new FormData()
                    fd.append('csrfmiddlewaretoken', csrftoken)
                    fd.append('photo', base64data)

                    $.ajax({
                        type: 'POST',
                        url: '/savepic/',
                        enctype: 'multipart/form-data',
                        data: fd,
                        processData: false,
                        contentType: false,
                        success: (resp) => {
                            console.log(resp)
                        },
                        error: (err) => {
                            console.log(err)
                        }
                    })
                }
            }).catch(error => {
                console.log('takePhoto() error: ', error);
            });
        }
        });
    
    })

    .catch(error => {
        console.log("Something went wrong!", error);
    });
}