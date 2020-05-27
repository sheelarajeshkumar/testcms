import React, { Component } from 'react'
import { dialog } from '../sweet-dialog';

class chFile extends Component {


    constructor(props) {
        super(props)

        this.state = {
            selectUrls: [],
            selectFiles: []
        }
    }

    async handleFileChange(e) {

        const selectFiles = this.props.multiple ? ([...this.props.form.values[this.props.field.name]] || []) : []

        var isExist = false;
        const target = e.target

        for (var i = 0; i < target.files.length; i++) {

            selectFiles.forEach(file => {

                if (file.name == target.files[i].name) {
                    isExist = true;
                }
            })

            if (!isExist) {
                const file = target.files[i]
                const path = await this.getRealPathImage(file)
                selectFiles.push({ imageFile: file, description: "", path: path, urlPreview: path, fieldName: this.props.field.name });
            }

        }

        if (this.props.onChange) {
            this.props.onChange(selectFiles)
        }
        this.inputFile.value = null

    }

    render() {

        const { field, form: { touched, errors }, label, danger, required, isExample, onChange = () => { }, onRemove = ()=>{}, className, multiple, disabled, ...other } = this.props
        const isError = Boolean((errors[field.name] && touched[field.name]))

        return (
            <div>
                <div>
                    <label>{label} {required && <span className="text-danger">*</span>} {(danger && danger != '') && <span className="text-danger">{danger}</span>}
                    </label>
                    <div className={className ? className : "input-group col-md-3 ml-0 pl-0"}>
                        <div className="input-group-prepend"><span className="input-group-text"><i className="fa fa-upload" /></span>
                        </div>
                        <div className="custom-file" >
                            <input
                                // name={field.name}
                                disabled={disabled}
                                multiple={multiple}
                                ref={ref => {
                                    this.inputFile = ref
                                }} type="file"
                                className="custom-file-input"
                                accept="image/png, image/jpeg, image/gif"
                                onChange={this.handleFileChange.bind(this)} />

                            <label className="custom-file-label text-left">Choose file</label>
                        </div>
                    </div>

                </div>
                {isError && <div className="text-danger">{errors[field.name]}</div>}
                {this.renderPicture()}

            </div>
        )
    }

    removeImage(index) {
        const { deleteMessage } = this.props
        dialog.showDialogConfirm({
            message: deleteMessage,
            onConfirm: () => {
                const files = [...this.props.form.values[this.props.field.name]] || []
                const removedImg = files.splice(index, 1)
                this.props.onRemove(removedImg)
                this.props.form.setFieldValue(this.props.field.name, [...files])
            }
        })

    }

    renderPicture() {

        const files = this.props.form.values[this.props.field.name] || []

        return (
            <div className="row mt-2 ml-1">
                {files.map((file, index) => (
                    <div key={index} className="container-image-preview">

                        <img className="image-preview" width="400" src={(file.fileUrl && file.fileUrl != '') ? file.fileUrl : file.urlPreview} />

                        <button type="button" className="remove-button" onClick={() => {
                            this.removeImage(index)
                        }}>
                            <i className="fas fa-times"></i>
                        </button>

                    </div>
                ))}
            </div>
        )
    }



    getRealPathImage(file) {

        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result)

            }
            reader.readAsDataURL(file)

        })
    }
}


const ChooseFile = (chFile)
export { ChooseFile } 