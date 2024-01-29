import { useCallback, useMemo, useRef, useState } from "react";
import QRCode from "qrcode.react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import html2canvas from "html2canvas";

interface IWifiTypes {
  name: string;
  value: string;
}

interface IWifiProps {
  ssid: string;
  password: string;
  networkType: string;
}

const WifiQRGenerator = () => {
  const [ssid, setSSID] = useState("");
  const [password, setPassword] = useState("");
  const [wifiType, setWifiType] = useState("");
  const [generatedQR, setGeneratedQR] = useState("");
  const generateQRRef = useRef<IWifiProps>({
    ssid: "",
    networkType: "",
    password: "",
  });
  const qrCodeRef = useRef<HTMLDivElement | null>(null);

  const wifiTypes = useMemo<IWifiTypes[]>(() => {
    return [
      { name: "WPA/WPA2", value: "WPA" },
      { name: "WEP", value: "WEP" },
      { name: "WPA3", value: "WPA3" },
    ];
  }, []);

  const generateWifiQR = useCallback(() => {
    setGeneratedQR(`WIFI:T:${wifiType};S:${ssid};P:${password};;`);
    if (generateQRRef.current) {
      generateQRRef.current.ssid = ssid;
      generateQRRef.current.networkType = wifiType;
      generateQRRef.current.password = password;
    }
  }, [wifiType, ssid, password, setGeneratedQR, generateQRRef]);

  const downloadQRCode = useCallback(() => {
    if (qrCodeRef.current) {
      html2canvas(qrCodeRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        link.download = "wifi-qr.png";
        link.click();
      });
    }
  }, [qrCodeRef]);

  return (
    <div>
      <h1 className="mb-3 text-center">Personal WiFi QR Code Generator</h1>
      <Form>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">
            SSID:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              placeholder="SSID"
              onChange={(e) => {
                setSSID(e.target.value);
              }}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">
            Password:
          </Form.Label>
          <Col sm="9">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">
            Network Type:
          </Form.Label>
          <Col sm="9">
            <Form.Select
              aria-label="Network type"
              onChange={(e) => {
                setWifiType(e.target.value);
              }}
            >
              <option value="">Select network type</option>
              {wifiTypes.map((type, i) => (
                <option
                  key={i}
                  value={type.value}
                  selected={type.value === wifiType}
                >
                  {type.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>
        <div className="d-grid gap-2">
          <Button
            onClick={generateWifiQR}
            disabled={!ssid || !password || !wifiType}
          >
            Generate
          </Button>
        </div>
      </Form>
      {generatedQR && (
        <Container className="p-4">
          <Row className="gap-3 p-4" ref={qrCodeRef}>
            <Row className="justify-content-sm-center">
              <QRCode value={generatedQR} size={256} />
            </Row>
            <Row className="justify-content-sm-center">
              <Col className="text-center text-info" sm={12}>
                {`SSID : ${generateQRRef.current?.ssid}`}
              </Col>
              <Col className="text-center text-info" sm={12}>
                {`Password : ${generateQRRef.current?.password}`}
              </Col>
              <Col className="text-center text-info" sm={12}>
                {`Network Type : ${generateQRRef.current?.networkType}`}
              </Col>
            </Row>
          </Row>
          <Row className="mt-3">
              <Button
                onClick={downloadQRCode}
              >
                Download
              </Button>
            </Row>
        </Container>
      )}
    </div>
  );
};

export default WifiQRGenerator;
