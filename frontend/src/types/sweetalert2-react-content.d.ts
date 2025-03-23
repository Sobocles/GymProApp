// src/types/sweetalert2-react-content.d.ts

declare module 'sweetalert2-react-content' {
    import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
  
    interface ReactSwal extends typeof Swal {
      fire(options: SweetAlertOptions): Promise<SweetAlertResult<any>>;
    }
  
    function withReactContent(Swal: typeof Swal): ReactSwal;
  
    export default withReactContent;
  }
  