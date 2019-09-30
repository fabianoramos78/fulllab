import React from 'react'
import { View, Text, ActivityIndicator, FlatList, StyleSheet, } from 'react-native'
import { Card, Button, SearchBar } from 'react-native-elements'
import { Colors } from 'react-native/Libraries/NewAppScreen'

import fetchSearch from '../services/fetchSearch'

export default class Home extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isLoading: true
    }    
  }
  
  componentDidMount() {
    return fetch(fetchSearch+'/Search/Criteria', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Query: '',
        Offset: 0,
        Size: 10
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        dataSource: responseJson.Products              
      })
      console.log(responseJson.Products)
    })
    .catch((error) => {
      error
    })
  }  

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.loading}>
          <ActivityIndicator style={styles.loading}/>
        </View>
      )
    }

    return( 
      <View>
        <SearchBar
          placeholder='Pesquisa...'
          lightTheme={true}
          value={null}
        />   
        <FlatList     
          data={this.state.dataSource}
          style={styles.container}        
          renderItem={({ item }) => {
            //alias dos retornos JSON
            productKey = item.RealId,
            productName = item.Name,
            productImage = item.Skus[0].Images[0].ImageUrl,
            productDescription = item.Skus[0].ComplementName,
            productCount = item.Skus[0].Sellers[0].BestInstallment.Count

            return(          
            <Card                                         
              title={productName}           
              image={{uri: productImage}}              
            >
            <Text style={styles.description}>{productDescription}</Text> 
            <Text style={styles.price}>{item.Skus[0].Sellers[0].Price} ou em até {productCount} vezes de {item.Skus[0].Sellers[0].BestInstallment.Value}</Text>             
            <Button              
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
              title='Comprar' />
            <Text style={styles.codProduto}>Ref.: {productKey}</Text>                
            </Card>
            )
          }          
        }
        keyExtractor={(item) => item.productKey+item.Id}      
        />
    </View>    
    )
  }
}

const styles = StyleSheet.create({
  loading: {
    flex:1, 
    paddingTop: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    marginVertical: 20,
    backgroundColor: Colors.lighter,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    backgroundColor: Colors.lighter,
  },
  description: {
    paddingTop: 5,
  },
  price: {
    paddingTop: 5,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center'
  },
  codProduto: {
    paddingTop: 5,
    marginBottom: 2,
    textAlign: 'right'
  }
})




