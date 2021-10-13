import { useEffect, useState } from "react";
import {
  Card,
  Container,
  Dropdown,
  Grid,
  GridColumn,
  Icon,
} from "semantic-ui-react";
import { cityList, getPharmacy } from "./Services";

export interface IDetail {
  EczaneAdi: string;
  Adresi: string;
  Semt: string;
  YolTarifi: string;
  Telefon: string;
  Telefon2: string;
  Sehir: string;
  ilce: string;
  latitude: number;
  longitude: number;
}

function App() {
  function turkishToEnglish(inp: any) {
    return inp
      .replace(/Ğ/gim, "G")
      .replace(/Ü/gim, "U")
      .replace(/Ş/gim, "S")
      .replace(/İ/gim, "I")
      .replace(/Ö/gim, "O")
      .replace(/Ç/gim, "C")
      .replace(/ğ/gim, "g")
      .replace(/ü/gim, "u")
      .replace(/ş/gim, "s")
      .replace(/ı/gim, "i")
      .replace(/ö/gim, "o")
      .replace(/ç/gim, "c");
  }

  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [countyOptions, setCountyOptions] = useState([]);
  const [pharmacyList, setPharmacyList] = useState<IDetail[]>([]);
  const [status, setStatus] = useState(false);

  function cityChange(a: any) {
    setCity(a);
  }

  function countyChange(a: any) {
    setCounty(a);
  }

  /* En basta tum eczaneleri listeliyor, sonra sehir seciliyse sadece sehir */
  useEffect(() => {
    if (county === "" && city === "") {
      //getPharmacy().then((res) => console.log(res));
      console.log("Initialized!");
    } else if (county === "") {
      pharmacyGetCity();
    } else {
      pharmacyGet();
    }
    // eslint-disable-next-line
  }, [city, county]);

  async function pharmacyGetCity() {
    const arr: IDetail[] = [];
    await getPharmacy(city).then((res) => {
      res.data.data.map((a: IDetail) => {
        return arr.push(a);
      });
    });
    
    setStatus(true);
    setPharmacyList(arr);
  }

  async function pharmacyGet() {
    const arr: IDetail[] = [];
    await getPharmacy(city, county).then((res) => {
      res.data.data.map((a: IDetail) => {
        return arr.push(a);
      });
    });
    setStatus(true);
    setPharmacyList(arr);
  }

  /* City - County Match */
  useEffect(() => {
    const a: any = [];
    const b: any = [];
    cityList().then((res) =>
      res.data.map((e: any) => {
        a.push({ key: e.plaka_kodu, value: e.il_adi, text: e.il_adi });
        setCityOptions(a);
        if (city === turkishToEnglish(e.il_adi)) {
          e.ilceler.map((a: any, index: number) => {
            b.push({ key: index, value: a.ilce_adi, text: a.ilce_adi });
            return setCountyOptions(b);
          });
        }
        return e;
      })
    );
  }, [city, county]);

  return (
    <>
      <Container>
        <Grid columns={2} style={{ marginTop: 15 }}>
          <GridColumn>
            <Dropdown
              placeholder="Select City"
              fluid
              search
              selection
              options={cityOptions}
              onChange={(e) => {
                console.log(e.currentTarget.children[0].textContent);
                cityChange(
                  turkishToEnglish(e.currentTarget.children[0].textContent)
                );
              }}
            />
          </GridColumn>

          {city && (
            <GridColumn>
              <Dropdown
                placeholder="Select County"
                fluid
                search
                selection
                options={countyOptions}
                onChange={(e) => {
                  console.log(e.currentTarget.children[0].textContent);
                  countyChange(
                    turkishToEnglish(e.currentTarget.children[0].textContent)
                  );
                }}
              />
            </GridColumn>
          )}
        </Grid>
        <Grid columns={5} style={{ marginTop: 15 }}>
          {status &&
            pharmacyList.map((pharmacy, index) => {
              return (
                <GridColumn key={index}>
                  <Card>
                    <Card.Content header={pharmacy.EczaneAdi} />
                    <Card.Content
                      description={
                        pharmacy.Sehir +
                        " " +
                        pharmacy.ilce +
                        " " +
                        pharmacy.Semt
                      }
                    />
                    <Card.Content description={pharmacy.Adresi} />
                    <Card.Content extra>
                      <Icon name="text telephone" />
                      {pharmacy.Telefon}
                    </Card.Content>
                  </Card>
                </GridColumn>
              );
            })}
        </Grid>
      </Container>
    </>
  );
}

export default App;
