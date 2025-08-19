import request from "@/utils/request";

export function uploadFile(data) {
  var formData = new FormData();
  formData.append("file", data.file);
  formData.append("path", data.path);


  return request({
    url: '/utils/uploadFile/',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data:formData
  })
}