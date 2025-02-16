package net.tylerwade.backend.lib.classes;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.tylerwade.backend.lib.StatusTypes;

@NoArgsConstructor @Getter @Setter
public class ResponseMessage<T> {

    private T data;
    private StatusTypes status;
    private String message;


    public ResponseMessage(T data, StatusTypes status, String message) {
        this.data = data;
        this.status = status;
        this.message = message;
    }

    public ResponseMessage(StatusTypes status, String message) {
        this.status = status;
        this.message = message;
    }

}
