import { extendTheme } from '@chakra-ui/react';
import { mode, Styles } from '@chakra-ui/theme-tools';

const styles: Styles = {
  global: (props: any) => ({
    body: {
      // Light, dark
      bg: mode('#ffffff', '#22272E')(props)
    }
  })
};

const components = {
  Heading: {
    variants: {
      'section-title': {
        textDecoration: 'underline',
        fontSize: 20,
        textUnderlineOffset: 6,
        textDecorationColor: '#525252',
        textDecorationThickness: 4,
        marginTop: 3,
        marginBottom: 4
      },
      'company-title': {
        fontSize: 20,
        textDecorationThickness: 4,
        marginTop: 3,
        marginBottom: 0
      }
    }
  },
  Link: {
    baseStyle: (props: any) => ({
      color: mode('#3d7aed', '#ff63c3')(props),
      textUnderlineOffset: 3
    })
  }
};

const fonts = {
  heading: "'Montserrat'"
};

const colors = {
  navBarPrimary: '#b794f4'
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true
};

const theme = extendTheme({ styles, components, fonts, colors, config });
export default theme;
